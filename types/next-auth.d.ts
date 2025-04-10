import { Profile, Account } from "next-auth/providers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      github_id?: string | null;
      bio?: string | null;
      website?: string | null;
      created_at?: Date;
    };
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
    }
  }
  