import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  providers: [
    {
      id: "zitadel",
      name: "ZITADEL",
      type: "oauth",

      issuer: process.env.ZITADEL_ISSUER,
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,

      wellKnown: `${process.env.ZITADEL_ISSUER}/.well-known/openid-configuration`,

      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      userinfo: `${process.env.ZITADEL_ISSUER}/oidc/v1/userinfo`,

      checks: ["pkce", "state"],

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;

      return session;
    },
  },
};
