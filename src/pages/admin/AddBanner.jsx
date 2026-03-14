import React, { useState, useEffect } from "react";
// Path: src/pages/admin/banners/AddBanner.jsx
import { addBanner, getAllBanners, deleteBanner } from "../../api/adminAPI";
import { uploadImage } from "../../services/CloudinaryService";
import Loader from "../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const AddBanner = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  // ================= FETCH BANNERS =================
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      setBanners(res.data.banners);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadImage(file);
      setImage(res.secure_url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD BANNER =================
  const handleAddBanner = async () => {
    if (!title || !image) return alert("Title and image are required.");
    setLoading(true);
    try {
      await addBanner({ title, link, image, isActive });
      setTitle("");
      setLink("");
      setImage("");
      setIsActive(true);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE BANNER =================
  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    setLoading(true);
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Banner</h2>

      {loading && <Loader />}

      {/* Add Banner Form */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="text"
          placeholder="Banner Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Banner Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <div>
          <label className="block mb-2 font-semibold">Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border px-3 py-2 rounded w-full"
          />
          {image && (
            <img src={image} alt="Banner" className="h-24 mt-2 rounded object-cover" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label>Active</label>
        </div>
        <button
          onClick={handleAddBanner}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Banner
        </button>
      </div>

      {/* Banners Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Link</th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Active</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b._id} className="text-center">
                <td className="border px-3 py-2">{b.title}</td>
                <td className="border px-3 py-2">
                  {b.link ? (
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border px-3 py-2">
                  <img src={b.image} alt={b.title} className="h-16 mx-auto rounded object-cover" />
                </td>
                <td className="border px-3 py-2">{b.isActive ? "Yes" : "No"}</td>
                <td className="border px-3 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleDeleteBanner(b._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddBanner;