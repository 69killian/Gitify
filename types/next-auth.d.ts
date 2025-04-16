import type { DefaultSession } from "next-auth";
import 'next-auth';

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username: string;
      github_id?: string | null;
      bio?: string | null;
      website?: string | null;
      created_at?: Date;
    } & DefaultSession["user"];
  }

  interface Profile {
    bio?: string;
    blog?: string;
    login?: string;
  }

  interface Account {
    providerAccountId: string;
    access_token: string;
    token_type: string;
    scope: string;
  }
}


declare module "next-auth/jwt" {
    interface JWT {
      sub: string;
      github_id?: string | null;
      username?: string | null;
      bio?: string | null;
      website?: string | null;
      created_at?: Date | null;
      accessToken?: string;
    }
  }
  