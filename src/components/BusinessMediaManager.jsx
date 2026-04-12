// frontend/src/components/BusinessMediaManager.jsx
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const BusinessMediaManager = ({ value = [], onChange }) => {
  const [loading, setLoading] = useState(false);

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
    return json.secure_url;
  };

  // ================= DROP =================
  const onDrop = async (files) => {
    try {
      setLoading(true);

      const uploaded = await Promise.all(files.map(uploadFile));
      const valid = uploaded.filter(Boolean);

      const updated = [...value, ...valid];

      // 🔥 controlled component
      onChange(updated);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
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
          {loading ? "Uploading..." : "Upload images"}
        </p>
      </div>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-2">
        {value.length > 0 ? (
          value.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
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
        ) : (
          <p className="text-xs text-gray-400 col-span-3 text-center">
            No images
          </p>
        )}
      </div>
    </div>
  );
};

export default BusinessMediaManager;