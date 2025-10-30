import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
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
          },
        });
        return {
          id: user.id,
          name: user.name || "Guest",
          email: user.email || undefined,
        };
      },
    }),
  ],
  trustHost: true,
});

export { GET, POST }
