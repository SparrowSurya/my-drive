import NextAuth from "next-auth"; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module "next-auth" {
  export interface User {
    email: string;
    profilePic: string | null;
  }

  export interface Session {
    user: User;
  }

  export interface Token {
    id: number | string,
    sub: string,
  }
}
