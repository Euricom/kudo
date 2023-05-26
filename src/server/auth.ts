import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const adminList = [
  "046df486-1162-4d77-9165-b7b9d20efaca",
  "cdb23f58-65db-4b6b-b132-cf2d13d08e76",
  "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2",
  "3ee83cb0-0b0d-4d50-a52d-e72969fdd173",
  "3d8adaf0-bc2e-4dbd-91c3-4ffa1d6f4a4a",
  "b3859788-62e8-478c-81cc-c1678c477d8a",
  "96f9d38d-0695-460d-a832-c1d289f4521a",
  "2d82a697-e23d-4105-a42e-16632d1aa80d",
  "52e5318a-df4f-453b-97e6-0f822258a4c7",
  "3e77d9c2-7b25-4407-b02d-e3eca6779319",
  "381f36f0-08ea-44d9-b4d6-f1eed84f48da",
  "a19c5290-d59a-467d-925e-fe0a7c7a8871",
  "c9945e77-14b5-4c28-8f6c-1bbf1c810728",
  "0bfdff3c-d745-49b9-a3f4-52957701b7b6",
]; //Kobe: 18d332af-2d5b-49e5-8c42-9168b3910f97
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_AD_TENANT_ID,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
