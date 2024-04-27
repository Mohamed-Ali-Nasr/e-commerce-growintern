"use client";

import "@styles/Search.scss";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IWork } from "@types";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [loading, setLoading] = useState(true);

  const [workList, setWorkList] = useState<IWork[]>([]);

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/search/${query}`, {
        method: "GET",
      });

      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWorkList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <h1 className="title-list">{query} result(s)</h1>

      <WorkList data={workList} />
    </>
  );
};

export default SearchPage;
