import React, { useEffect, useState } from "react";
import { getAllBanners, deleteBanner } from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import BannerForm from "../../components/banner/BannerForm";
import { FaTrash } from "react-icons/fa";

const AdminAddBanner = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  // FETCH
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      setBanners(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // DELETE
  const handleDelete = async (bannerId) => {
    if (!window.confirm("Delete this banner?")) return;

    setLoading(true);
    try {
      await deleteBanner(bannerId);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Banner Management</h2>

      {loading && <Loader />}

      {/* FORM */}
      <div className="mb-6">
        <BannerForm mode="admin" onSuccess={fetchBanners} />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
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
                <td className="border px-2 py-2">{b.title}</td>

                <td className="border px-2 py-2">
                  {b.link ? (
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="border px-2 py-2">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-16 mx-auto rounded object-cover"
                  />
                </td>

                <td className="border px-2 py-2">
                  {b.isActive ? "Yes" : "No"}
                </td>

                <td className="border px-2 py-2">
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 mx-auto"
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

export default AdminAddBanner;