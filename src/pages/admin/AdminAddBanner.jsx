import React, { useEffect, useState } from "react";

import {
  getAllBanners,
  deleteBanner,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import BannerForm from "../../components/banner/BannerForm";

import { FaTrash } from "react-icons/fa";

const AdminAddBanner = () => {
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState([]);

  /* ================= FETCH ================= */

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await getAllBanners();

      const data =
        res?.data?.data ||
        res?.data?.banners ||
        [];

      setBanners(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(err);

      setBanners([]);

      alert("Failed to fetch banners");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (bannerId) => {
    if (
      !window.confirm(
        "Delete this banner?"
      )
    ) {
      return;
    }

    // optimistic update
    const previous = banners;

    setBanners((prev) =>
      prev.filter(
        (b) => b._id !== bannerId
      )
    );

    try {
      await deleteBanner(bannerId);

    } catch (err) {
      console.error(err);

      // rollback
      setBanners(previous);

      alert("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Banner Management
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Create and manage homepage banners
        </p>
      </div>

      {/* FORM */}
      <div className="mb-8">
        <BannerForm
          mode="admin"
          onSuccess={fetchBanners}
        />
      </div>

      {/* LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Banner
                  </th>

                  <th className="px-4 py-3 text-left">
                    Link
                  </th>

                  <th className="px-4 py-3 text-center">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {banners.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-gray-500"
                    >
                      No banners found
                    </td>
                  </tr>
                ) : (
                  banners.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* BANNER */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              b.image ||
                              "/placeholder.png"
                            }
                            alt={b.title}
                            className="w-20 h-14 rounded object-cover border"
                          />

                          <div>
                            <div className="font-medium">
                              {b.title || "Untitled"}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                              ID: {b._id}
                            </div>
                          </div>

                        </div>

                      </td>

                      {/* LINK */}
                      <td className="px-4 py-3">

                        {b.link ? (
                          <a
                            href={b.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline break-all"
                          >
                            Open Link
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            No link
                          </span>
                        )}

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3 text-center">

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {b.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              handleDelete(b._id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FaTrash />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}
    </div>
  );
};

export default AdminAddBanner;