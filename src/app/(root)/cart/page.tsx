"use client";

import Navbar from "@components/Navbar";
import {
  AddCircle,
  ArrowCircleLeft,
  Delete,
  RemoveCircle,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Loader from "@components/Loader";
import "@styles/Cart.scss";
import { ICart } from "@types";
import Link from "next/link";
import getStripe from "@lib/getStripe";

const Cart = () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?.id;

  const updateCart = async (cart: ICart[]) => {
    const response = await fetch(`/api/user/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    update({ user: { cart: data } });
  };

  const calcSubtotal = (cart: ICart[]) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const increaseQty = (cartItem: ICart) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart!);
  };

  const decreaseQty = (cartItem: ICart) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart!);
  };

  const removeFromCart = (cartItem: ICart) => {
    const newCart = cart?.filter((item) => item.workId !== cartItem.workId);
    updateCart(newCart!);
  };

  const subtotal = calcSubtotal(cart!);

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, userId }),
    });

    if (response.status === 500) {
      return;
    }

    const data = await response.json();

    const result = stripe?.redirectToCheckout({ sessionId: data.id });

    const resultError = (await result)?.error;

    if (resultError) {
      console.log(resultError.message);
    }
  };

  return !session?.user?.cart ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>Your Cart</h1>
            <h2>
              Subtotal: <span>${subtotal}</span>
            </h2>
          </div>

          {cart?.length === 0 && <h3>Empty Cart</h3>}

          {cart?.length! > 0 && (
            <div className="all-items">
              {cart?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="product" />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>Category: {item.category}</p>
                      <p>Seller: {item.creator.username}</p>
                    </div>
                  </div>

                  <div className="quantity">
                    <AddCircle
                      onClick={() => increaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    />
                    <h3>{item.quantity}</h3>
                    <RemoveCircle
                      onClick={() => decreaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div className="price">
                    <h2>${item.quantity * item.price}</h2>
                    <p>${item.price} / each</p>
                  </div>

                  <div className="remove">
                    <Delete
                      sx={{ cursor: "pointer" }}
                      onClick={() => removeFromCart(item)}
                    />
                  </div>
                </div>
              ))}

              <div className="bottom">
                <Link href="/">
                  <ArrowCircleLeft /> Continue Shopping
                </Link>
                <button onClick={handleCheckout}>CHECK OUT NOW</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
