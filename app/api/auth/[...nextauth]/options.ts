import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GithubProvider from "next-auth/providers/github"
import prisma from "@/lib/prisma"

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Missing GitHub OAuth credentials");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                github_id: account.providerAccountId,
                updated_at: new Date()
              }
            });

            // Vérifier si le compte est bien lié
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: "github"
              }
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type!,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                },
              });
            }

          } else {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: profile?.login || user.name || 'user',
                avatar_url: user.image,
                github_id: account.providerAccountId,
                created_at: new Date(),
                updated_at: new Date(),
              }
            });

            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              },
            });
          }

          return true;

        } catch (error) {
          console.error('Erreur:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
