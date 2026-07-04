import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "zitadel",
      name: "ZITADEL",
      type: "oauth",

      issuer: process.env.ZITADEL_ISSUER,
      clientId: process.env.ZITADEL_CLIENT_ID,

      wellKnown: `${process.env.ZITADEL_ISSUER}/.well-known/openid-configuration`,

      authorization: {
        params: {
          scope: "openid profile email",
        },
      },

      checks: ["pkce", "state"],

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
});

export { handler as GET, handler as POST };