import { ICart } from "@types";
import { NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export const POST = async (req: Request, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { cart, userId } = await req.json();
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1P9hpYBo6aYu8z7dW5IWIpBI" },
          { shipping_rate: "shr_1P9hn1Bo6aYu8z7drzub7zKq" },
        ],
        line_items: cart?.map((item: ICart) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
                images: [`${req.headers.get("origin")}/${item.image}`],
                metadata: {
                  productId: item.workId,
                },
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          };
        }),
        client_reference_id: userId,
        success_url: `${req.headers.get("origin")}/success`,
        cancel_url: `${req.headers.get("origin")}/canceled`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      return new Response(JSON.stringify(session), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to chaeckout", { status: 500 });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
