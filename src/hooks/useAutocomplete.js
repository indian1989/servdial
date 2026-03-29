import { useState, useEffect } from "react";
import API from "../api/axios";

export const useAutocomplete = (query, city) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query || query.length < 1) {
        setSuggestions([]);
        return;
      }

      const fetchSuggestions = async () => {
        try {
          setLoading(true);

          const res = await API.get("/search/autocomplete", {
            params: { q: query, city },
          });

          setSuggestions(res.data.suggestions || []);
        } catch (err) {
          console.error("Autocomplete error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }, 250); // FAST UX

    return () => clearTimeout(delayDebounce);
  }, [query, city]);

  return { suggestions, loading };
};