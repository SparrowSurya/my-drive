import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async signIn({ user }) {
			const { email } = user;
			const select = {
				id: true,
				email: true,
				profilePic: true,
				password: false,
			};

			const existingUser = await prisma.user.findFirst({ where: { email }, select });
			return !!existingUser;
		},
		async session({ session, token }) {
			const { email } = token;
			if (email) {
				const user = await prisma.user.findFirst({ where: { email }});
				if (user) {
					return {
						...session,
						user: {
							email,
							profilePic: user.profilePic,
						}
					};
				}
			}
			return session;
		},
	},
	providers: [
		Credentials({
			credentials: {
				email: { type: "email" },
				password: { type: "password" },
			},
			async authorize(credentials, req) {
				if (credentials === undefined) return null;

				const { email, password } = credentials!;
				const select = { id: true, email: true, profilePic: true, password: true };
				const existingUser = await prisma.user.findFirst({ where: { email }, select });

				const url = req?.body?.callbackUrl?.toString() ?? "";;
				const login = url?.split("?")?.[0]?.endsWith("login") ?? false;
				const signin = url?.split("?")?.[0]?.endsWith("signin") ?? false;

				if (login) {
					if (existingUser === null) {
						throw new Error("Invalid credentials!");
					}
					const hashedPassword = existingUser.password ?? "";
					const match = await bcrypt.compare(password, hashedPassword);
					if (match) {
						return {
							id: existingUser.id.toString(),
							email: existingUser.email,
							profilePic: existingUser.profilePic,
						};
					}
					throw new Error("Invalid credentials!");
				}

				if (signin) {
					if (existingUser !== null) {
						throw new Error("User already exists!");
					}

					const salt = await bcrypt.genSalt(11);
					const hashedPassword = await bcrypt.hash(password, salt);
					const user = await prisma.user.create({
						data: {
							email,
							password: hashedPassword,
							authProvider: null,
						},
						select: {
							id: true,
							email: true,
							profilePic: true,
							password: false,
						}
					});
					return {
						id: user.id.toString(),
						email: user.email,
						profilePic: user.profilePic,
					};
				}

				return null;
			},
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile: async (profile: Record<string, string>) => {
				const { email, picture } = profile;
				const select = { id: true, email: true, profilePic: true };
				const existingUser = await prisma.user.findUnique({ where: { email }, select });
				if (existingUser) {
					return { ...existingUser, id: existingUser.id.toString() };
				}

				const user = await prisma.user.create({
					data: {
						email,
						profilePic: picture,
						password: null,
						authProvider: "google",
					},
					select,
				});
				return { ...user, id: user.id.toString() };
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET!,
} as AuthOptions;

