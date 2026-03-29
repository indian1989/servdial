import { useState, useEffect } from "react";
import API from "../api/axios";

export const useTrendingSearches = (city, category) => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await API.get("/search/trending", {
          params: { city, category },
        });

        setTrends(res.data.trends || []);
      } catch (err) {
        console.error("Trending fetch error:", err);
      }
    };

    fetchTrends();
  }, [city, category]);

  return trends;
};