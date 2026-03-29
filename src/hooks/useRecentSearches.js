import { useState, useEffect } from "react";
import API from "../api/axios";

export const useRecentSearches = () => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await API.get("/search/recent");
        setRecent(res.data.searches || []);
      } catch {
        setRecent([]);
      }
    };

    fetchRecent();
  }, []);

  return recent;
};