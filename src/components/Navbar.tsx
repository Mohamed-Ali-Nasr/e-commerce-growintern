"use client";

import "@styles/Navbar.scss";
import { Menu, Person, Search, ShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const cart = user?.cart;
  const router = useRouter();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    signOut({ callbackUrl: "/login" });
  };

  const searchWork = async () => {
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    document.addEventListener("click", () => setDropdownMenu(false));

    return () => {
      document.removeEventListener("click", () => setDropdownMenu(false));
    };
  });

  return (
    <div className="navbar">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton disabled={query === ""} onClick={searchWork}>
          <Search sx={{ color: "red" }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user && (
          <Link href="/cart" className="cart">
            <ShoppingCart sx={{ color: "gray" }} />
            Cart <span>({cart?.length})</span>
          </Link>
        )}

        <div
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <button
            className="navbar_right_account"
            onClick={() => setDropdownMenu((prevState) => !prevState)}
          >
            <Menu sx={{ color: "gray" }} />
            {!user ? (
              <Person sx={{ color: "gray" }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImagePath}
                alt="profile"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </button>

          {dropdownMenu && !user && (
            <div className="navbar_right_accountmenu">
              <Link href="/login">Log In</Link>
              <Link href="/register">Sign Up</Link>
            </div>
          )}

          {dropdownMenu && user && (
            <div className="navbar_right_accountmenu">
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/order">Orders</Link>
              <Link href={`/shop?id=${user.id}`}>Your Shop</Link>
              <Link href="/create-work">Sell Your Work</Link>
              <a onClick={handleLogout}>Log Out</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
