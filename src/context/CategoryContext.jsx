
import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import API from "../api/axios";

export const CategoryContext = createContext();

const DB_NAME = "servdial-offline-db";
const STORE_NAME = "categories";
const DB_VERSION = 1;
const CACHE_KEY = "all-categories";

const openCategoryDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = window.indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "key",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveCategoriesOffline = async (payload) => {
  const db = await openCategoryDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    transaction.objectStore(STORE_NAME).put({
      key: CACHE_KEY,
      categories: payload.categories,
      tree: payload.tree,
      savedAt: Date.now(),
    });

    transaction.oncomplete = () => {
      db.close();
      resolve(true);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const getCategoriesOffline = async () => {
  const db = await openCategoryDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_NAME)
      .get(CACHE_KEY);

    request.onsuccess = () => {
      const result = request.result;
      db.close();
      resolve(result || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/categories");

      const data =
        res.data?.categories ||
        res.data?.data ||
        [];

      const tree = res.data?.tree || [];

      setCategories(data);
      setCategoryTree(tree);

      try {
        await saveCategoriesOffline({
          categories: data,
          tree,
        });
      } catch (cacheError) {
        console.error(
          "Category offline save failed:",
          cacheError
        );
      }

    } catch (err) {
      console.error("Error fetching categories", err);

      try {
        const cached = await getCategoriesOffline();

        if (cached) {
          setCategories(cached.categories || []);
          setCategoryTree(cached.tree || []);

          console.log(
            "✅ Categories loaded from IndexedDB"
          );
        }
      } catch (cacheError) {
        console.error(
          "Category offline load failed:",
          cacheError
        );
      }

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handleOnline = () => {
      fetchCategories();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        categoryTree,
        loading,
        fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
