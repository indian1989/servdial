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
    const children = cat.subcategories || [];

    const label = parent
      ? `${cat.name} (${parent})`
      : cat.name;

    if (children.length === 0) {
      result.push({
        value: cat._id,
        label,
      });
    }

    if (children.length > 0) {
      result = result.concat(flattenCategories(children, cat.name));
    }
  });

  return result;
};

/* ================= STYLE ================= */
const styles = {
  control: (base) => ({
    ...base,
    borderRadius: "10px",
    padding: "4px",
  }),
};

/* ================= DEFAULT FORM ================= */
const defaultForm = {
  name: "",
  categoryId: "",
  cityId: "",
  district: "",
  state: "",
  location: null,

  address: "",
  pincode: "",
  phone: "",
  whatsapp: "",
  website: "",
  description: "",

  // provider fields (IMPORTANT)
  images: [],
  logo: "",
  businessHours: {},
  tags: [],
  boost: false,
};

const BusinessForm = ({
  initialData = {},
  onSubmit,
  onChange,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  /* ================= SAFE INIT (NO DATA LOSS) ================= */
  const [form, setForm] = useState(() => ({
    ...defaultForm,
    ...initialData,
  }));

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          getAllCategories(),
          API.get("/cities"),
        ]);

        const raw = catRes?.data?.data || [];
        const tree = buildCategoryTree(raw);

        setCategories(flattenCategories(tree));

        const cityRaw = cityRes?.data?.data?.cities;

        if (!Array.isArray(cityRaw)) {
          setError("Failed to load cities");
          return;
        }

        const normalizedCities = cityRaw.map((c) => ({
          value: c._id,
          label: `${c.name}${c.state ? ` (${c.state})` : ""}`,
          district: c.district || "",
          state: c.state || "",
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
        }));

        setCities(normalizedCities);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data");
      }
    };

    init();
  }, []);

  /* ================= FIX: KEEP FULL DATA ================= */
  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...defaultForm,
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated =
      name === "pincode"
        ? { ...form, [name]: value.replace(/\D/g, "").slice(0, 6) }
        : name === "phone" || name === "whatsapp"
        ? { ...form, [name]: value.replace(/\D/g, "").slice(0, 10) }
        : { ...form, [name]: value };

    setForm(updated);
    onChange?.(updated);
  };

  /* ================= SELECT ================= */
  const handleSelect = (field, selected) => {
    if (!selected) return;

    if (field === "cityId") {
      const updated = {
        ...form,
        cityId: selected.value,
        district: selected.district,
        state: selected.state,
        location: {
          type: "Point",
          coordinates: [
            selected.longitude,
            selected.latitude,
          ],
        },
      };

      setForm(updated);
      onChange?.(updated);
      return;
    }

    if (field === "categoryId") {
      const updated = {
        ...form,
        categoryId: selected.value,
      };

      setForm(updated);
      onChange?.(updated);
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name) return "Business name required";
    if (!form.categoryId) return "Category required";
    if (!form.cityId) return "City required";
    if (!form.pincode || form.pincode.length !== 6)
      return "Valid pincode required";
    if (!form.phone || form.phone.length !== 10)
      return "Valid phone required";
    if (!form.location) return "City location required";

    return "";
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setError(err);

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
          value={form.name}
          onChange={handleChange}
          placeholder="Business Name"
          className="border p-2 rounded"
        />

        <Select
          options={categories}
          value={categories.find(c => c.value === form.categoryId) || null}
          onChange={(v) => handleSelect("categoryId", v)}
          styles={styles}
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded"
        />

        <Select
          options={cities}
          value={cities.find(c => c.value === form.cityId) || null}
          onChange={(v) => handleSelect("cityId", v)}
          styles={styles}
        />

        <input value={form.district} readOnly className="bg-gray-100 p-2" />
        <input value={form.state} readOnly className="bg-gray-100 p-2" />

        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="border p-2 rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded"
        />

        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp"
          className="border p-2 rounded"
        />

        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website"
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded"
        />

        {children}

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Saving..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default BusinessForm;