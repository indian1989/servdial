// src/hooks/useGallery.js

import { useState } from "react";

const useGallery = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const openGallery = (index = 0) => {
    setActiveImg(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  return {
    activeImg,
    setActiveImg,
    showGallery,
    setShowGallery,
    openGallery,
    closeGallery,
  };
};

export default useGallery;