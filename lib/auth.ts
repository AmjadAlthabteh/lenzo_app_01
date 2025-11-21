import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { verifyTOTPToken } from "@/lib/twoFactor";
import { logActivity } from "@/lib/activity";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpToken: { label: "2FA Token (if enabled)", type: "text", optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.toString().toLowerCase().trim();
        const password = credentials.password.toString();
        const totpToken = credentials.totpToken?.toString();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Check if account is locked
        if (user.locked) {
          throw new Error("Account is locked. Please contact support.");
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
          // Increment failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: user.failedLoginAttempts + 1,
              lastFailedLogin: new Date(),
              locked: user.failedLoginAttempts + 1 >= 5,
            },
          });

          throw new Error("Invalid email or password");
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled) {
          if (!totpToken) {
            throw new Error("2FA_REQUIRED");
          }

          if (!user.twoFactorSecret) {
            throw new Error("2FA configuration error");
          }

          const is2FAValid = verifyTOTPToken(user.twoFactorSecret, totpToken);

          if (!is2FAValid) {
            throw new Error("Invalid 2FA token");
          }
        }

        // Reset failed login attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lastFailedLogin: null,
          },
        });

        // Log successful login
        await logActivity({
          userId: user.id,
          action: "login",
          metadata: { method: "credentials" },
        });

        return {
          id: user.id,
          name: user.name || "User",
          email: user.email || undefined,
          image: user.image || undefined,
        };
      },
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: { name: { label: "Name", type: "text" } },
      async authorize(credentials) {
        const name = (credentials?.name || "").toString().trim();
        if (!name) return null;
        const user = await prisma.user.upsert({
          where: {
            email: `${name
              .toLowerCase()
              .replace(/\s+/g, ".")}.guest@lenso.local`,
          },
          update: { name },
          create: {
            name,
            email: `${name
              .toLowerCase()
              .replace(/\s+/g, ".")}.guest@lenso.local`,
            role: "USER",
          },
        });

        await logActivity({
          userId: user.id,
          action: "login",
          metadata: { method: "guest" },
        });

        return {
          id: user.id,
          name: user.name || "Guest",
          email: user.email || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).role = dbUser.role;
          (session.user as any).twoFactorEnabled = dbUser.twoFactorEnabled;
        }
      }
      return session;
    },
  },
  trustHost: true,
});
