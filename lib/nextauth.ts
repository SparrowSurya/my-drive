import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createUser, getUniqueUser, updateUser } from "./query/user";
import { matchPassword } from "./query/auth";
import { isLoginRoute, isSigninRoute } from "./utils/urls";
import { LoginSchema, SigninSchema } from "./schema";
import { getFirstZodError } from "./utils/zod";


export const authOptions = {
	session: {
		strategy: "jwt",
		maxAge: parseInt(process.env.SESSION_MAX_AGE!),
		updateAge: parseInt(process.env.SESSION_MAX_AGE!),
	},
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async signIn(data) {
			const { email } = data.user;
			const select = {
				id: true,
				name: true,
				email: true,
				profilePic: true,
				password: false,
			};

			const existingUser = await getUniqueUser({ email }, select);
			return !!existingUser;
		},
		async session(data) {
			const { email } = data.token;
			if (email) {
				const user = await getUniqueUser({ email });
				if (user) {
					return {
						...data.session,
						user: {
							name: user.name,
							email,
							profilePic: user.profilePic,
						}
					};
				}
			}
			return data.session;
		},
	},
	providers: [
		Credentials({
			credentials: {
				name: { type: "name" },
				email: { type: "email" },
				password: { type: "password" },
				confirmPassword: { type: "confirmPassword" },
			},
			async authorize(credentials, req) {
				if (credentials === undefined) {
					throw new Error("Empty credentials");
				};

				const { name, email, password } = credentials!;
				const select = { id: true, name: true, email: true, profilePic: true, password: true };
				const existingUser = await getUniqueUser({ email }, select);

				const url = req?.body?.callbackUrl?.toString() ?? "";;
				const login = url.length == 0 ? false : isLoginRoute(url);
				const signin = url.length == 0 ? false : isSigninRoute(url);

				if (login) {
					if (existingUser === null) {
						throw new Error("Invalid credentials!");
					}

					const loginData = { email, password };
					const result = LoginSchema.safeParse(loginData);
					if (!result.success) {
						const firstError = getFirstZodError(result.error);
						throw new Error(firstError);
					}

					const hashedPassword = existingUser.password ?? "";
					const match = await matchPassword(password, hashedPassword);
					if (match) {
						return {
							id: existingUser.id.toString(),
							name: name,
							email: existingUser.email,
							profilePic: existingUser.profilePic,
						};
					}
					throw new Error("Invalid credentials!");
				}

				if (signin) {
					if (existingUser !== null) {
						// User already exists.
						throw new Error("Failed to signin!");
					}

					const data = { name, email, password, confirmPassword: credentials.confirmPassword };
					const result = SigninSchema.safeParse(data);
					if (!result.success) {
						const firstError = getFirstZodError(result.error);
						throw new Error(firstError);
					}

					const safeData = { ...result.data, confirmPassword: undefined, authProvider: null };
					const select = { id: true, name: true,	email: true,	profilePic: true,	password: false };
					const user = await createUser(safeData, select);
					return {
						id: user.id.toString(),
						name: user.name,
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
				const { name, email, picture } = profile;
				const select = { id: true, name: true, email: true, profilePic: true };
				const existingUser = await getUniqueUser({ email }, select);
				if (existingUser) {
					if (existingUser.name != name) {
						await updateUser({ name }, { email });
					}
					return { ...existingUser, name, id: existingUser.id.toString() };
				}

				const data = { name, email, profilePic: picture, authProvider: "google" };
				const user = await createUser(data, select);
				return { ...user, id: user.id.toString() };
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET!,
} as AuthOptions;

