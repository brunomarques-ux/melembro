import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY ?? "",
      from: "onboarding@resend.dev",
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      await db.user.update({
        where: { id: user.id! },
        data: {
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await db.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          (session.user as any).plan = dbUser.plan;
          (session.user as any).trialEndsAt = dbUser.trialEndsAt;
          (session.user as any).stripeCurrentPeriodEnd = dbUser.stripeCurrentPeriodEnd;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});
