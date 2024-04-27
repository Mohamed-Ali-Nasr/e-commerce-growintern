"use client";

import WorkList from "./WorkList";
import { useEffect, useState } from "react";
import "@styles/Categories.scss";
import Loader from "./Loader";
import { categories } from "@constants";
import { IWork } from "@types";

const Feed = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [workList, setWorkList] = useState<IWork[]>([]);

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/list/${selectedCategory}`);
      if (response.ok) {
        const data = await response.json();
        setWorkList(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="categories">
        {categories?.map((item, index) => (
          <p
            onClick={() => setSelectedCategory(item)}
            className={`${item === selectedCategory ? "selected" : ""}`}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

      <WorkList data={workList} />
    </>
  );
};

export default Feed;
