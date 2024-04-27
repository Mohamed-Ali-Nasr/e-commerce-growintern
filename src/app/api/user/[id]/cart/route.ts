import { connectToDatabase } from "@lib/database";
import User from "@lib/database/models/user.model";

export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { cart } = await req.json();

    await connectToDatabase();

    const userId = params.id;

    const user = await User.findById(userId);

    user.cart = cart;

    await user.save();

    return new Response(JSON.stringify(user.cart), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update card", { status: 500 });
  }
};
