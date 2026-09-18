import { useMemo, useState } from "react";

const useBlogShare = (blog) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const currentUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return blog?.slug
      ? `https://www.servdial.com/blog/${blog.slug}`
      : "";
  }, [blog?.slug]);

  return {
    showShareMenu,
    setShowShareMenu,
    currentUrl,
  };
};

export default useBlogShare;