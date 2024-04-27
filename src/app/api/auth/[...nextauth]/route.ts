import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Email or Password");
        }

        await connectToDatabase();

        /* Check if the user exists */
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        /* Compare password */
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();

          /* Check is the user exist */
          let user = await User.findOne({ email: profile?.email });

          if (!user) {
            user = await User.create({
              email: profile?.email,
              username: profile?.name,
              profileImagePath: (profile as any)?.picture,
              wishlist: [],
              cart: [],
              order: [],
              work: [],
            });
          }

          return user;
        } catch (err: any) {
          console.log("Error checking if user exists: ", err.message);
        }
      }

      return true;
    },

    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
        session.user = { ...session.user, ...sessionUser._doc };
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
