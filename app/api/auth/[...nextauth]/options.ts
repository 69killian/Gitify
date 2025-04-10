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

          const userData = {
            github_id: account.providerAccountId,
            username: profile?.login || user.name || 'user',
            avatar_url: user.image,
            bio: profile?.bio || '',
            website: profile?.blog || '',
            updated_at: new Date(),
          };

          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: userData
            });

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
                ...userData,
                email: user.email!,
                created_at: new Date(),
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

    async jwt({ token, user }) {
      if (user) {
        const userInDb = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            github_id: true,
            username: true,
            bio: true,
            website: true,
            created_at: true,
          },
        });
    
        if (userInDb) {
          token.sub = userInDb.id;
          token.github_id = userInDb.github_id;
          token.username = userInDb.username;
          token.bio = userInDb.bio;
          token.website = userInDb.website;
          token.created_at = userInDb.created_at;
        }
      }
    
      return token;
    }
    ,

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const userInDb = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            github_id: true,
            username: true,
            bio: true,
            website: true,
            created_at: true,
          }
        });

        if (userInDb) {
          session.user.github_id = userInDb.github_id ?? null;
          session.user.username = userInDb.username ?? null;
          session.user.bio = userInDb.bio ?? null;
          session.user.website = userInDb.website ?? null;
          session.user.created_at = userInDb.created_at ?? null;
        }
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
