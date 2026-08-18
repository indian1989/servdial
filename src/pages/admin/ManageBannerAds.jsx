import React, { useEffect, useState } from "react";
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../api/adminAPI";
import { uploadImage } from "../../services/CloudinaryService";
import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const PAGE_SIZE = 10;

const ManageBannerAds = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ================= ADD BANNER =================

  const [newBanner, setNewBanner] = useState({
    image: "",
    link: "",
    isActive: true,
  });

  // ================= EDIT BANNER =================

  const [editingBannerId, setEditingBannerId] = useState(null);

  const [editingBannerData, setEditingBannerData] = useState({
    image: "",
    link: "",
    isActive: true,
  });

  // ================= FETCH BANNERS =================

  const fetchBanners = async () => {
    setLoading(true);

    try {
      const res = await getAllBanners();

      const list =
        res?.data?.data ||
        res?.data?.banners ||
        res?.data ||
        [];

      setBanners(Array.isArray(list) ? list : []);
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
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadImage(file);

      const imageUrl = res?.secure_url;

      if (!imageUrl) {
        throw new Error("Image URL not received.");
      }

      if (isEditing) {
        setEditingBannerData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      } else {
        setNewBanner((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD BANNER =================

  const handleAddBanner = async () => {
    if (!newBanner.image || !newBanner.link) {
      alert("Image and Link are required.");
      return;
    }

    setLoading(true);

    try {
      await addBanner({
        image: newBanner.image,
        link: newBanner.link,
        isActive: newBanner.isActive,
      });

      setNewBanner({
        image: "",
        link: "",
        isActive: true,
      });

      await fetchBanners();

      alert("Banner added successfully.");
    } catch (err) {
      console.error("Add banner error:", err);
      alert("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE BANNER =================

  const handleUpdateBanner = async (id) => {
    if (
      !editingBannerData.image ||
      !editingBannerData.link
    ) {
      alert("Image and Link are required.");
      return;
    }

    setLoading(true);

    try {
      await updateBanner(id, {
        image: editingBannerData.image,
        link: editingBannerData.link,
        isActive: editingBannerData.isActive,
      });

      setEditingBannerId(null);

      setEditingBannerData({
        image: "",
        link: "",
        isActive: true,
      });

      await fetchBanners();

      alert("Banner updated successfully.");
    } catch (err) {
      console.error("Update banner error:", err);
      alert("Failed to update banner.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE BANNER =================

  const handleDeleteBanner = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this banner?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await deleteBanner(id);

      await fetchBanners();

      alert("Banner deleted successfully.");
    } catch (err) {
      console.error("Delete banner error:", err);
      alert("Failed to delete banner.");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT START =================

  const startEditing = (banner) => {
    setEditingBannerId(banner._id);

    setEditingBannerData({
      image: banner.image || "",
      link: banner.link || "",
      isActive: banner.isActive === true,
    });
  };

  // ================= CANCEL EDIT =================

  const cancelEditing = () => {
    setEditingBannerId(null);

    setEditingBannerData({
      image: "",
      link: "",
      isActive: true,
    });
  };

  // ================= FILTER =================

  const filteredBanners = banners.filter((banner) => {
    const query = search.toLowerCase();

    const link =
      banner.link?.toLowerCase() || "";

    const status =
      banner.isActive
        ? "active"
        : "inactive";

    return (
      link.includes(query) ||
      status.includes(query)
    );
  });

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredBanners.length / PAGE_SIZE
  );

  const paginatedBanners =
    filteredBanners.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  // ================= SEARCH PAGE RESET =================

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // ================= RENDER =================

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Manage Banner Ads
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create, manage and monitor your banner advertisements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaPlus />
          {banners.length} Banners
        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-5">

        <input
          type="text"
          placeholder="Search banners by link or status..."
          value={search}
          onChange={(e) =>
            handleSearch(e.target.value)
          }
          className="
            w-full
            border
            border-gray-200
            px-4
            py-3
            rounded-xl
            outline-none
            focus:ring-2
            focus:ring-blue-500
            bg-white
          "
        />

      </div>

      {/* TABLE */}

      {loading ? (

        <Loader />

      ) : (

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-gray-50">

                <tr className="text-left text-sm text-gray-600">

                  <th className="px-4 py-3">
                    Image
                  </th>

                  <th className="px-4 py-3">
                    Link
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {paginatedBanners.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="
                        text-center
                        py-12
                        text-gray-500
                      "
                    >
                      No banners found.
                    </td>

                  </tr>

                ) : (

                  paginatedBanners.map((banner) => {

                    const isEditing =
                      editingBannerId === banner._id;

                    return (

                      <tr
                        key={banner._id}
                        className="
                          border-t
                          hover:bg-gray-50
                          transition
                        "
                      >

                        {/* IMAGE */}

                        <td className="px-4 py-4">

                          {isEditing ? (

                            <div className="space-y-2">

                              {editingBannerData.image ? (

                                <img
                                  src={
                                    editingBannerData.image
                                  }
                                  alt="Banner"
                                  className="
                                    h-20
                                    w-36
                                    object-cover
                                    rounded-lg
                                  "
                                />

                              ) : (

                                <div className="
                                  h-20
                                  w-36
                                  bg-gray-100
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  text-xs
                                  text-gray-400
                                ">
                                  No Image
                                </div>

                              )}

                              <label className="
                                inline-block
                                cursor-pointer
                                text-xs
                                text-blue-600
                                hover:text-blue-700
                              ">

                                Change Image

                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(
                                      e,
                                      true
                                    )
                                  }
                                />

                              </label>

                            </div>

                          ) : (

                            <img
                              src={banner.image}
                              alt="Banner"
                              className="
                                h-20
                                w-36
                                object-cover
                                rounded-lg
                              "
                            />

                          )}

                        </td>

                        {/* LINK */}

                        <td className="px-4 py-4">

                          {isEditing ? (

                            <input
                              type="text"
                              value={
                                editingBannerData.link
                              }
                              onChange={(e) =>
                                setEditingBannerData(
                                  (prev) => ({
                                    ...prev,
                                    link: e.target.value,
                                  })
                                )
                              }
                              className="
                                border
                                px-3
                                py-2
                                rounded-lg
                                w-full
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                              "
                            />

                          ) : (

                            <span className="
                              text-sm
                              text-gray-700
                              break-all
                            ">
                              {banner.link || "—"}
                            </span>

                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          {isEditing ? (

                            /*
                             * THIS IS THE SELECT
                             * YOU ASKED ABOUT
                             */

                            <select
                              value={
                                editingBannerData.isActive
                                  ? "true"
                                  : "false"
                              }
                              onChange={(e) =>
                                setEditingBannerData(
                                  (prev) => ({
                                    ...prev,
                                    isActive:
                                      e.target.value ===
                                      "true",
                                  })
                                )
                              }
                              className="
                                border
                                border-gray-200
                                px-3
                                py-2
                                rounded-lg
                                bg-white
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                              "
                            >

                              <option value="true">
                                Active
                              </option>

                              <option value="false">
                                Inactive
                              </option>

                            </select>

                          ) : (

                            <span
                              className={`
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                ${
                                  banner.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >
                              {banner.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-4">

                          <div className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            flex-wrap
                          ">

                            {isEditing ? (

                              <>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateBanner(
                                      banner._id
                                    )
                                  }
                                  className="
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-green-500
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-green-600
                                    transition
                                  "
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    cancelEditing
                                  }
                                  className="
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-gray-200
                                    text-gray-700
                                    text-sm
                                    font-medium
                                    hover:bg-gray-300
                                    transition
                                  "
                                >
                                  Cancel
                                </button>

                              </>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    banner
                                  )
                                }
                                className="
                                  px-3
                                  py-2
                                  rounded-lg
                                  bg-yellow-500
                                  text-white
                                  text-sm
                                  font-medium
                                  hover:bg-yellow-600
                                  transition
                                  flex
                                  items-center
                                  gap-1.5
                                "
                              >
                                <FaEdit />
                                Edit
                              </button>

                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteBanner(
                                  banner._id
                                )
                              }
                              className="
                                px-3
                                py-2
                                rounded-lg
                                bg-red-500
                                text-white
                                text-sm
                                font-medium
                                hover:bg-red-600
                                transition
                                flex
                                items-center
                                gap-1.5
                              "
                            >
                              <FaTrash />
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* PAGINATION */}

      {!loading && totalPages > 1 && (

        <div className="
          flex
          justify-center
          items-center
          gap-2
          mt-5
          flex-wrap
        ">

          {Array.from(
            { length: totalPages },
            (_, index) => {

              const page = index + 1;

              return (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`
                    min-w-9
                    h-9
                    px-3
                    rounded-lg
                    border
                    text-sm
                    font-medium
                    transition
                    ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {page}
                </button>

              );

            }
          )}

        </div>

      )}

      {/* =====================================================
          ADD BANNER
      ===================================================== */}

      <div className="
        mt-8
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-4
        sm:p-6
      ">

        <h3 className="text-lg font-bold text-gray-900 mb-5">
          Add New Banner
        </h3>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          items-end
        ">

          {/* IMAGE */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e, false)
              }
              className="
                w-full
                border
                rounded-lg
                p-2
                text-sm
              "
            />

            {newBanner.image && (

              <img
                src={newBanner.image}
                alt="Preview"
                className="
                  mt-3
                  h-20
                  w-36
                  object-cover
                  rounded-lg
                "
              />

            )}

          </div>

          {/* LINK */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Banner Link
            </label>

            <input
              type="text"
              value={newBanner.link}
              onChange={(e) =>
                setNewBanner((prev) => ({
                  ...prev,
                  link: e.target.value,
                }))
              }
              placeholder="https://example.com"
              className="
                w-full
                border
                px-3
                py-2.5
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          {/* STATUS + BUTTON */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Status
            </label>

            <div className="flex gap-2">

              <select
                value={
                  newBanner.isActive
                    ? "true"
                    : "false"
                }
                onChange={(e) =>
                  setNewBanner((prev) => ({
                    ...prev,
                    isActive:
                      e.target.value ===
                      "true",
                  }))
                }
                className="
                  border
                  px-3
                  py-2.5
                  rounded-lg
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>

              </select>

              <button
                type="button"
                onClick={handleAddBanner}
                className="
                  flex-1
                  px-4
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  text-white
                  font-medium
                  hover:bg-blue-700
                  transition
                "
              >
                Add Banner
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ManageBannerAds;