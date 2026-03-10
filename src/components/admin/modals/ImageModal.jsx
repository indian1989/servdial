import React from "react";
import { FaTimes } from "react-icons/fa";

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-3xl w-full mx-4 p-4 bg-white rounded shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={image}
            alt="Preview"
            className="max-h-[80vh] object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;