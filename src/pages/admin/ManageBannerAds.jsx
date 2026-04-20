import React, { useState, useEffect } from "react";
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../api/adminAPI";
import { uploadImage } from "../../services/CloudinaryService";
import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";

const PAGE_SIZE = 10;

const ManageBannerAds = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [newBanner, setNewBanner] = useState({
    image: "",
    link: "",
    isActive: true / false,
  });

  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingBannerData, setEditingBannerData] = useState({
    image: "",
    link: "",
    isActive: true / false,
  });

  // ================= FETCH BANNERS =================
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      setBanners(res.data.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      alert("Failed to fetch banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadImage(file);
      if (isEditing) {
        setEditingBannerData({ ...editingBannerData, image: res.secure_url });
      } else {
        setNewBanner({ ...newBanner, image: res.secure_url });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD / UPDATE / DELETE =================
  const handleAddBanner = async () => {
    if (!newBanner.image || !newBanner.link) return alert("Image and Link are required.");
    setLoading(true);
    try {
      await addBanner(newBanner);
      setNewBanner({ image: "", link: "", status: "active" });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBanner = async (id) => {
    if (!editingBannerData.image || !editingBannerData.link) return alert("Image and Link are required.");
    setLoading(true);
    try {
      await updateBanner(id, editingBannerData);
      setEditingBannerId(null);
      setEditingBannerData({ image: "", link: "", status: "active" });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to update banner.");
    } finally {
      setLoading(false);
    }
  };

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

  // ================= FILTER & PAGINATION =================
  const filteredBanners = banners.filter(
    (b) =>
      b.link.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBanners.length / PAGE_SIZE);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= RENDER =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Banner Ads</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search banners..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Link</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBanners.map((banner) => (
                <tr key={banner._id} className="text-center">
                  <td className="border px-3 py-2">
                    {editingBannerId === banner._id ? (
                      editingBannerData.image ? (
                        <img
                          src={editingBannerData.image}
                          alt="Banner"
                          className="h-20 w-40 object-cover mx-auto rounded"
                        />
                      ) : (
                        "No image"
                      )
                    ) : (
                      <img
                        src={banner.image}
                        alt="Banner"
                        className="h-20 w-40 object-cover mx-auto rounded"
                      />
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {editingBannerId === banner._id ? (
                      <input
                        type="text"
                        value={editingBannerData.link}
                        onChange={(e) =>
                          setEditingBannerData({ ...editingBannerData, link: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      banner.link
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {editingBannerId === banner._id ? (
                      <select
  value={newBanner.isActive}
  onChange={(e) =>
    setNewBanner({
      ...newBanner,
      isActive: e.target.value === "true",
    })
  }
>
  <option value="true">Active</option>
  <option value="false">Inactive</option>
</select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded ${
                          banner.status === "active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                        }`}
                      >
                        {banner.status}
                      </span>
                    )}
                  </td>
                  <td className="border px-3 py-2 flex justify-center gap-2 flex-wrap">
                    {editingBannerId === banner._id ? (
                      <button
                        onClick={() => handleUpdateBanner(banner._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingBannerId(banner._id);
                          setEditingBannerData({
                            image: banner.image,
                            link: banner.link,
                            status: banner.status,
                          });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBannerAds;