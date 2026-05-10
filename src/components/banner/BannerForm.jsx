import React, { useEffect, useState } from "react";
import Select from "react-select";

import API from "../../api/axios";

import {
  addBanner,
  getAllCategories,
} from "../../api/adminAPI";

import { uploadImage } from "../../services/CloudinaryService";

import { buildCategoryTree } from "../../utils/adminUtils";

import Loader from "../common/Loader";

/* ================= SELECT STYLES ================= */

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "10px",
    borderColor: state.isFocused
      ? "#3b82f6"
      : "#d1d5db",
    boxShadow: "none",

    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
};

/* ================= CATEGORY FLATTEN ================= */

const flattenCategories = (tree = []) => {
  let result = [];

  tree.forEach((cat) => {
    const children = cat.subcategories || [];

    // ✅ ONLY LEAF CATEGORIES
    if (children.length === 0) {
      result.push({
        value: cat._id,
        label: cat.name,
      });
    }

    if (children.length > 0) {
      result = result.concat(
        flattenCategories(children)
      );
    }
  });

  return result;
};

/* ================= COMPONENT ================= */

const BannerForm = ({
  mode = "admin",
  onSuccess,
}) => {
  const isAdmin = mode === "admin";

  const [loading, setLoading] =
    useState(false);

  const [cities, setCities] = useState([]);
  const [categories, setCategories] =
    useState([]);

  const [form, setForm] = useState({
    title: "",
    link: "",
    image: "",
    placement: "homepage_top",

    cityId: "",
    categoryId: "",

    isActive: true,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, cityRes] =
          await Promise.all([
            getAllCategories(),
            API.get("/cities"),
          ]);

        /* ===== CATEGORIES ===== */

        const rawCategories =
          catRes?.data?.data || [];

        const tree =
          buildCategoryTree(rawCategories);

        setCategories(
          flattenCategories(tree)
        );

        /* ===== CITIES ===== */

        const rawCities =
          cityRes?.data?.data?.cities || [];

        const normalizedCities =
          rawCities.map((c) => ({
            value: c._id,
            label: c.name,
          }));

        setCities(normalizedCities);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  /* ================= INPUT ================= */

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadImage(file);

      updateForm(
        "image",
        res?.secure_url || ""
      );
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return alert("Title is required");
    }

    if (!form.image) {
      return alert("Banner image required");
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),

        link: form.link?.trim() || "",

        image: form.image,

        placement: form.placement,

        cityId: form.cityId || null,

        categoryId:
          form.categoryId || null,

        isActive: isAdmin
          ? form.isActive
          : true,
      };

      const res = await addBanner(payload);

      /* ===== RESET ===== */

      setForm({
        title: "",
        link: "",
        image: "",
        placement: "homepage_top",

        cityId: "",
        categoryId: "",

        isActive: true,
      });

      /* ===== PROVIDER FLOW ===== */

      if (!isAdmin) {
        const bannerId =
          res?.data?.data?._id;

        window.location.href = `/provider/banner/payment/${bannerId}`;

        return;
      }

      onSuccess?.();

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to create banner"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="grid gap-4">

      {loading && <Loader />}

      {/* TITLE */}
      <input
        type="text"
        placeholder="Banner Title"
        value={form.title}
        onChange={(e) =>
          updateForm(
            "title",
            e.target.value
          )
        }
        className="border px-3 py-3 rounded-xl"
      />

      {/* LINK */}
      <input
        type="text"
        placeholder="Banner Link"
        value={form.link}
        onChange={(e) =>
          updateForm(
            "link",
            e.target.value
          )
        }
        className="border px-3 py-3 rounded-xl"
      />

      {/* IMAGE */}
      <div className="space-y-2">

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {form.image && (
          <img
            src={form.image}
            alt="Banner"
            className="h-28 rounded-xl object-cover border"
          />
        )}

      </div>

      {/* PLACEMENT */}
      <select
        value={form.placement}
        onChange={(e) =>
          updateForm(
            "placement",
            e.target.value
          )
        }
        className="border px-3 py-3 rounded-xl"
      >
        <option value="homepage_top">
          Homepage Top
        </option>

        <option value="homepage_middle">
          Homepage Middle
        </option>

        <option value="homepage_bottom">
          Homepage Bottom
        </option>

        <option value="category_page">
          Category Page
        </option>

        <option value="city_page">
          City Page
        </option>
      </select>

      {/* CITY SELECT */}
      <div>
        <label className="block text-sm font-medium mb-1">
          City (optional)
        </label>

        <Select
          options={cities}
          value={
            cities.find(
              (c) =>
                c.value === form.cityId
            ) || null
          }
          onChange={(selected) =>
            updateForm(
              "cityId",
              selected?.value || ""
            )
          }
          isClearable
          placeholder="Select City"
          styles={selectStyles}
        />
      </div>

      {/* CATEGORY SELECT */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Category (optional)
        </label>

        <Select
          options={categories}
          value={
            categories.find(
              (c) =>
                c.value ===
                form.categoryId
            ) || null
          }
          onChange={(selected) =>
            updateForm(
              "categoryId",
              selected?.value || ""
            )
          }
          isClearable
          placeholder="Select Category"
          styles={selectStyles}
        />
      </div>

      {/* ADMIN ONLY */}
      {isAdmin && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              updateForm(
                "isActive",
                e.target.checked
              )
            }
          />

          <span>Active</span>
        </label>
      )}

      {/* SUBMIT */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
      >
        {loading
          ? "Processing..."
          : isAdmin
          ? "Create Banner"
          : "Continue to Payment"}
      </button>

    </div>
  );
};

export default BannerForm;