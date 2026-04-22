import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "../../api/axios";
import { getAllCategories } from "../../api/adminAPI";
import { buildCategoryTree } from "../../utils/adminUtils";

// ================= FLATTEN CATEGORY TREE =================
const flattenCategories = (tree = [], parentName = "") => {
  let result = [];

  tree.forEach((cat) => {
    const hasChildren = (cat.subcategories || []).length > 0;

    if (!hasChildren) {
      result.push({
        value: cat._id,
        label: parentName ? `${cat.name} (${parentName})` : cat.name,
      });
    }

    if (hasChildren) {
      result = result.concat(flattenCategories(cat.subcategories, cat.name));
    }
  });

  return result;
};

const customStyles = {
  control: (base) => ({
    ...base,
    padding: "4px",
    borderRadius: "10px",
    borderColor: "#d1d5db",
    boxShadow: "none",
  }),
};

const BusinessForm = ({
  mode = "admin",
  initialData = {},
  onSubmit,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    city: "",
    district: "",
    state: "",
    address: "",
    phone: "",
    whatsapp: "",
    website: "",
    description: "",
    ...initialData,
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          getAllCategories(),
          API.get("/admin/cities"),
        ]);

        const tree = buildCategoryTree(
          catRes.data.flatCategories ||
            catRes.data.categories ||
            []
        );

        setCategories(flattenCategories(tree));

        setCities(
          (cityRes.data.cities || []).map((c) => ({
            value: c._id,
            label: `${c.name} (${c.state})`,
            district: c.district || "",
            state: c.state || "",
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "whatsapp") {
      const clean = value.replace(/\D/g, "").slice(0, 10);
      return setForm((prev) => ({ ...prev, [name]: clean }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SELECT =================
  const handleSelect = (field, selected) => {
    if (!selected) return;

    if (field === "city") {
      setForm((prev) => ({
        ...prev,
        city: selected.value,
        district: selected.district,
        state: selected.state,
      }));
      return;
    }

    if (field === "categoryId") {
      setForm((prev) => ({
        ...prev,
        categoryId: selected.value,
      }));
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name || !form.categoryId || !form.city || !form.phone) {
      return "Please fill required fields";
    }

    if (form.phone.length !== 10) {
      return "Phone must be 10 digits";
    }

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (e) {
      console.error(e);
      setError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          name="name"
          placeholder="Business Name *"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* CATEGORY */}
        <Select
          options={categories}
          value={categories.find(c => c.value === form.categoryId) || null}
          onChange={(v) => handleSelect("categoryId", v)}
          styles={customStyles}
          placeholder="Category *"
        />

        {/* ADDRESS */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* CITY */}
        <Select
          options={cities}
          value={cities.find(c => c.value === form.city) || null}
          onChange={(v) => handleSelect("city", v)}
          styles={customStyles}
          placeholder="City *"
        />

        {/* AUTO LOCATION */}
        <input value={form.district} readOnly className="border p-2 bg-gray-100 rounded" />
        <input value={form.state} readOnly className="border p-2 bg-gray-100 rounded" />

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Phone *"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* WHATSAPP */}
        <input
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* WEBSITE */}
        <input
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* CHILD FEATURES (provider/admin extensions) */}
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
