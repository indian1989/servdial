// frontend/src/components/BusinessMediaManager.jsx
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const BusinessMediaManager = ({ value = [], onChange }) => {
  const [uploading, setUploading] = useState([]);

  // ================= CLOUDINARY UPLOAD =================
  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "servdial");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    if (!json.secure_url) {
      throw new Error("Upload failed");
    }

    return json.secure_url;
  };

  // ================= DROP =================
  const onDrop = async (files) => {
    try {
      // create temp previews
      const tempPreviews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      // show instantly
      setUploading((prev) => [...prev, ...tempPreviews]);

      // upload in background
      const uploaded = await Promise.all(
        tempPreviews.map((item) => uploadFile(item.file))
      );

      const valid = uploaded.filter(Boolean);

      const MAX_IMAGES = 10;

      const updated = [...new Set([...value, ...valid])].slice(0, MAX_IMAGES);

      onChange(updated);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      // cleanup previews
      setUploading((prev) => {
        prev.forEach((item) =>
          URL.revokeObjectURL(item.preview)
        );
        return [];
      });
    }
  };

  // ================= DROPZONE CONFIG =================
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  // ================= REMOVE =================
  const removeImage = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Business Images</h3>

      {/* UPLOAD */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 text-center rounded cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {uploading.length > 0 ? "Uploading..." : "Upload images"}
        </p>
      </div>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-2">

        {/* 🔥 UPLOADING PREVIEWS */}
        {uploading.map((item, i) => (
          <div key={`uploading-${i}`} className="relative">
            <img
              src={item.preview}
              alt="uploading"
              className="w-full h-24 object-cover rounded opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs bg-black/40 text-white rounded">
              Uploading...
            </div>
          </div>
        ))}

        {/* ✅ FINAL IMAGES */}
        {value.length > 0 ? (
          value.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt={`business-${i}`}
                className="w-full h-24 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))
        ) : uploading.length === 0 ? (
          <p className="text-xs text-gray-400 col-span-3 text-center">
            No images
          </p>
        ) : null}

      </div>
    </div>
  );
};

export default BusinessMediaManager;