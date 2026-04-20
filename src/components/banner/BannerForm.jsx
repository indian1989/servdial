import React, { useState } from "react";
import { addBanner } from "../../api/adminAPI";
import { uploadImage } from "../../services/CloudinaryService";
import Loader from "../common/Loader";

const BannerForm = ({ mode = "admin", onSuccess }) => {
  const isAdmin = mode === "admin";

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    link: "",
    image: "",
    placement: "homepage_top",
    cityId: "",
    categoryId: "",
    isActive: true,
  });

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadImage(file);
      setForm({ ...form, image: res.secure_url });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.title || !form.image) {
      return alert("Title and image required");
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        link: form.link,
        image: form.image,
        placement: form.placement,
        cityId: form.cityId || null,
        categoryId: form.categoryId || null,
        isActive: isAdmin ? form.isActive : true,
      };

      const res = await addBanner(payload);

      setForm({
        title: "",
        link: "",
        image: "",
        placement: "homepage_top",
        cityId: "",
        categoryId: "",
        isActive: true,
      });

      // provider → payment flow
      if (!isAdmin) {
        const bannerId = res?.data?.data?._id;
        window.location.href = `/provider/banner/payment/${bannerId}`;
        return;
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-3">
      {loading && <Loader />}

      {/* TITLE */}
      <input
        type="text"
        placeholder="Banner Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border px-3 py-2 rounded"
      />

      {/* LINK */}
      <input
        type="text"
        placeholder="Banner Link"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
        className="border px-3 py-2 rounded"
      />

      {/* IMAGE */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {form.image && (
        <img src={form.image} className="h-24 rounded object-cover" />
      )}

      {/* PLACEMENT */}
      <select
        value={form.placement}
        onChange={(e) => setForm({ ...form, placement: e.target.value })}
        className="border px-3 py-2 rounded"
      >
        <option value="homepage_top">Homepage Top</option>
        <option value="homepage_middle">Homepage Middle</option>
        <option value="homepage_bottom">Homepage Bottom</option>
        <option value="category_page">Category Page</option>
        <option value="city_page">City Page</option>
      </select>

      {/* CITY ID */}
      <input
        type="text"
        placeholder="City ID (optional)"
        value={form.cityId}
        onChange={(e) => setForm({ ...form, cityId: e.target.value })}
        className="border px-3 py-2 rounded"
      />

      {/* CATEGORY ID */}
      <input
        type="text"
        placeholder="Category ID (optional)"
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        className="border px-3 py-2 rounded"
      />

      {/* ADMIN ONLY */}
      {isAdmin && (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          <label>Active</label>
        </div>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 rounded"
      >
        {isAdmin ? "Create Banner" : "Continue to Payment"}
      </button>
    </div>
  );
};

export default BannerForm;