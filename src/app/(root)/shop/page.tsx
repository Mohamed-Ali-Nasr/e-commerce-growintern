"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@styles/Shop.scss";
import { IUser, IWork } from "@types";

const Shop = () => {
  const [loading, setLoading] = useState(true);
  const [workList, setWorkList] = useState<IWork[]>([]);
  const [profile, setProfile] = useState<IUser>();

  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  useEffect(() => {
    const getWorkList = async () => {
      try {
        const response = await fetch(`api/user/${profileId}/shop`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setWorkList(data.workList);
        setProfile(data.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (profileId) {
      getWorkList();
    }
  }, [profileId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      {loggedInUserId === profileId && (
        <h1 className="title-list">Your Works</h1>
      )}

      {loggedInUserId !== profileId && (
        <h1 className="title-list">
          {profile?.username}
          {"'"}s Works
        </h1>
      )}

      <WorkList data={workList} />
    </>
  );
};

export default Shop;
