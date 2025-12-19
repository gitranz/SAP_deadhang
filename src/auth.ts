import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) return null;

                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.username, credentials.username as string));

                if (!user) {
                    return null;
                }

                const pwMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!pwMatch) return null;

                return { id: user.id, name: user.username };
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
