// src/components/business/BusinessForm.jsx

import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "../../api/axios";
import { getAllCategories } from "../../api/adminAPI";
import { buildCategoryTree } from "../../utils/adminUtils";

/* ================= SAFE CATEGORY FLATTEN ================= */
const flattenCategories = (tree = [], parent = "") => {
  let result = [];

  tree.forEach((cat) => {
    const children = cat.children || [];

    if (!children.length) {
      result.push({
        value: cat._id,
        label: parent ? `${cat.name} (${parent})` : cat.name,
      });
    }

    if (children.length) {
      result = result.concat(flattenCategories(children, cat.name));
    }
  });

  return result;
};

/* ================= SELECT STYLE ================= */
const styles = {
  control: (base) => ({
    ...base,
    borderRadius: "10px",
    padding: "4px",
  }),
};

const BusinessForm = ({ initialData = {}, onSubmit, children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    cityId: "",
    district: "",
    state: "",
    location: null,
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
    description: "",
    ...initialData,
  });

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    const init = async () => {
      try {
        // ✅ FIXED: use PUBLIC cities endpoint
        const [catRes, cityRes] = await Promise.all([
          getAllCategories(),
          API.get("/cities"),
        ]);

        // ✅ STRICT CATEGORY TREE
        const raw = catRes?.data?.categories || [];
        const tree = buildCategoryTree(raw);
        setCategories(flattenCategories(tree));

        // ✅ STRICT CITY NORMALIZATION
        const normalizedCities = (cityRes?.data?.cities || [])
          .filter((c) => c._id && c.name)
          .map((c) => ({
            value: c._id,
            label: `${c.name}${c.state ? ` (${c.state})` : ""}`,
            district: c.district || "",
            state: c.state || "",
            latitude: Number(c.latitude),
            longitude: Number(c.longitude),
          }));

        setCities(normalizedCities);
      } catch (err) {
        console.error("INIT ERROR:", err);
        setError("Failed to load form data");
      }
    };

    init();
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "whatsapp") {
      const clean = value.replace(/\D/g, "").slice(0, 10);
      return setForm((p) => ({ ...p, [name]: clean }));
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= SELECT ================= */
  const handleSelect = (field, selected) => {
    if (!selected) return;

    // ✅ CITY SELECT (CRITICAL FIX)
    if (field === "cityId") {
      const lat = Number(selected.latitude);
      const lng = Number(selected.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        setError("Selected city has invalid coordinates");
        return;
      }

      setForm((p) => ({
        ...p,
        cityId: selected.value,
        district: selected.district,
        state: selected.state,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }));

      return;
    }

    // ✅ CATEGORY SELECT
    if (field === "categoryId") {
      setForm((p) => ({
        ...p,
        categoryId: selected.value,
      }));
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name.trim()) return "Business name required";
    if (!form.categoryId) return "Category required";
    if (!form.cityId) return "City required";
    if (!form.phone) return "Phone required";
    if (form.phone.length !== 10) return "Phone must be 10 digits";
    if (!form.location) return "City must have valid location";

    return "";
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      console.error(err);
      setError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        <input
          name="name"
          placeholder="Business Name *"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <Select
          options={categories}
          value={categories.find(c => c.value === form.categoryId) || null}
          onChange={(v) => handleSelect("categoryId", v)}
          styles={styles}
          placeholder="Category *"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <Select
          options={cities}
          value={cities.find(c => c.value === form.cityId) || null}
          onChange={(v) => handleSelect("cityId", v)}
          styles={styles}
          placeholder="City *"
        />

        <input value={form.district} readOnly className="border p-2 bg-gray-100 rounded" />
        <input value={form.state} readOnly className="border p-2 bg-gray-100 rounded" />

        <input
          name="phone"
          placeholder="Phone *"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {children}

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default BusinessForm;