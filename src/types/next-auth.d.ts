import { ICart, IOrder, IWork } from "@types";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string | null;
      cart?: ICart[];
      profileImagePath?: string;
      wishlist?: IWork[];
      orders?: IOrder[];
    } & DefaultSession["user"];
  }
}
