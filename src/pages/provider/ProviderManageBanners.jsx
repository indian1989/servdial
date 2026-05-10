import React, { useEffect, useMemo, useState } from "react";

import {
  FaTrash,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBullhorn,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import API from "../../api/axios";

import Loader from "../../components/common/Loader";

const ProviderManageBanners = () => {
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState([]);

  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */

  const fetchBanners = async () => {
    setLoading(true);

    try {
      const res = await API.get("/provider/banners");

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

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this banner ad?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/provider/banners/${id}`);

      setBanners((prev) =>
        prev.filter((b) => b._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner");
    }
  };

  /* ================= FILTER ================= */

  const filteredBanners = useMemo(() => {
    const term = search.toLowerCase();

    return banners.filter((banner) => {
      return (
        banner.title
          ?.toLowerCase()
          .includes(term) ||
        banner.placement
          ?.toLowerCase()
          .includes(term)
      );
    });
  }, [banners, search]);

  /* ================= STATS ================= */

  const totalBanners = banners.length;

  const activeBanners = banners.filter(
    (b) => b.isActive
  ).length;

  const inactiveBanners =
    totalBanners - activeBanners;

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Manage Banner Ads
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View, monitor and manage your
            promotional campaigns
          </p>
        </div>

        <Link
          to="/provider/add-banner"
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <FaPlus />
          Add New Banner
        </Link>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Banners
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {totalBanners}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaBullhorn className="text-xl" />
            </div>

          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active
              </p>

              <h3 className="text-2xl font-bold mt-1 text-green-600">
                {activeBanners}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaCheckCircle className="text-xl" />
            </div>

          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inactive
              </p>

              <h3 className="text-2xl font-bold mt-1 text-red-600">
                {inactiveBanners}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <FaTimesCircle className="text-xl" />
            </div>

          </div>
        </div>

      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm mb-6">

        <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search banners..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-transparent outline-none text-sm"
          />

        </div>

      </div>

      {/* ================= LOADER ================= */}
      {loading && <Loader />}

      {/* ================= EMPTY ================= */}
      {!loading &&
        filteredBanners.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 mx-auto mb-4">
              <FaBullhorn className="text-2xl" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Banner Ads Found
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Start promoting your business
              by creating your first banner ad.
            </p>

            <Link
              to="/provider/add-banner"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
            >
              <FaPlus />
              Create Banner
            </Link>

          </div>
        )}

      {/* ================= LIST ================= */}
      <div className="grid gap-5">

        {filteredBanners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition"
          >

            <div className="flex flex-col lg:flex-row gap-5">

              {/* IMAGE */}
              <div className="lg:w-72 flex-shrink-0">

                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-48 object-cover rounded-2xl border"
                />

              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  {/* LEFT */}
                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      <h2 className="text-xl font-bold text-gray-900">
                        {banner.title}
                      </h2>

                      {banner.isActive ? (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <FaCheckCircle />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          <FaTimesCircle />
                          Inactive
                        </span>
                      )}

                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">

                      <div className="flex items-center gap-2">
                        <FaLayerGroup className="text-gray-400" />

                        <span>
                          {banner.placement}
                        </span>
                      </div>

                      {banner.cityId?.name && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />

                          <span>
                            {banner.cityId.name}
                          </span>
                        </div>
                      )}

                      {banner.categoryId?.name && (
                        <div className="flex items-center gap-2">
                          <FaLayerGroup className="text-gray-400" />

                          <span>
                            {banner.categoryId.name}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* LINK */}
                    {banner.link && (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 mt-4 hover:underline"
                      >
                        <FaExternalLinkAlt />

                        Open Banner Link
                      </a>
                    )}

                  </div>

                  {/* ACTIONS */}
                  <div className="flex lg:flex-col gap-3">

                    <button
                      onClick={() =>
                        handleDelete(banner._id)
                      }
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                      <FaTrash />

                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ProviderManageBanners;