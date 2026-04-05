// frontend/src/pages/admin/AdminAddBusiness.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { addBusiness, getAllCategories } from "../../api/adminAPI";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { buildCategoryTree } from "../../utils/adminUtils";

// 🔥 Flatten category tree
const flattenCategories = (tree, prefix = "") => {
  let result = [];

  tree.forEach((cat) => {
    const label = prefix ? `${prefix} › ${cat.name}` : cat.name;
    const hasChildren = cat.subcategories?.length > 0;

    // ✅ ONLY ADD IF LEAF NODE
    if (!hasChildren) {
      result.push({
        value: cat._id,
        label,
      });
    }

    // 🔁 ALWAYS TRAVERSE
    if (hasChildren) {
      result = result.concat(
        flattenCategories(cat.subcategories, label)
      );
    }
  });

  return result;
};

// 🎨 Styling
const customStyles = {
  control: (base) => ({
    ...base,
    padding: "4px",
    borderRadius: "10px",
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
};

const AdminAddBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [cities, setCities] = useState([]);

  const [businessData, setBusinessData] = useState({
  name: "",
  categoryId: "",
  address: "",
  city: "",
  cityId: "",
  district: "",
  state: "",
  stateSlug: "",
  districtSlug: "",
  phone: "",
  whatsapp: "",
  website: "",
  description: "",
});

  const [error, setError] = useState("");

  // ================= LOAD =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          getAllCategories(),
          API.get("/admin/cities"),
        ]);

        // ✅ CATEGORY TREE
        const flat = catRes.data.flatCategories || catRes.data.categories || [];

// ✅ build tree first
const tree = buildCategoryTree(flat);

// ✅ then flatten ONLY leaf nodes
setCategoryOptions(flattenCategories(tree));
console.log("RAW TREE:", catRes.data.categories);
console.log("TREE:", tree);
console.log(flat.filter(c => c.parentCategory));
        // ✅ CITY OPTIONS (UPDATED STRUCTURE)
        const cityOptions = (cityRes.data.cities || []).map((c) => ({
          value: c._id,
          label: `${c.name} (${c.state})`,
          name: c.name,
          district: c.district || "",
          state: c.state || "",
          districtSlug: c.districtSlug || "",
          stateSlug: c.stateSlug || "",
        }));

        setCities(cityOptions);

      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "phone" || name === "whatsapp") {
    const clean = value.replace(/\D/g, "").slice(0, 10);
    return setBusinessData((prev) => ({ ...prev, [name]: clean }));
  }

  setBusinessData((prev) => ({ ...prev, [name]: value }));
};

  // ================= SELECT =================
  const handleSelect = (field, selected) => {
  if (!selected) {
    return setBusinessData((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  // CITY
  if (field === "city") {
    setBusinessData((prev) => ({
      ...prev,
      city: selected.name,
      cityId: selected.value,
      district: selected.district,
      state: selected.state,
      districtSlug: selected.districtSlug,
      stateSlug: selected.stateSlug,
    }));
    return;
  }

  // CATEGORY
  if (field === "categoryId") {
    setBusinessData((prev) => ({
      ...prev,
      categoryId: selected.value,
    }));
  }
};

  // ================= VALIDATION =================
  const validate = () => {
  const { name, categoryId, city, district, state, phone } = businessData;

  if (!name || !categoryId || !city || !district || !state || !phone) {
    return "Please fill all required fields";
  }

  if (phone.length !== 10) {
    return "Phone must be 10 digits";
  }

  return "";
};

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    setError("");
    setLoading(true);

    try {
      await addBusiness({
        ...businessData,
      });

      alert("Business added successfully!");

      setBusinessData({
  name: "",
  categoryId: "",
  address: "",
  city: "",
  cityId: "",
  district: "",
  state: "",
  stateSlug: "",
  districtSlug: "",
  phone: "",
  whatsapp: "",
  website: "",
  description: "",
});

    } catch (err) {
      console.error(err);
      setError("Failed to add business");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Business</h2>

      {loading && <Loader />}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input
          type="text"
          name="name"
          placeholder="Business Name *"
          value={businessData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* CATEGORY */}
        <Select
  placeholder="🔍 Select category (leaf only)"
  options={categoryOptions}
  value={
    categoryOptions.find(
      (c) => c.value === businessData.categoryId
    ) || null
  }
  onChange={(val) => handleSelect("categoryId", val)}
  styles={customStyles}
  isSearchable
/>

        {/* Address*/}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={businessData.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* CITY */}
        <Select
  placeholder="Select City *"
  options={cities}
  value={
    cities.find((c) => c.value === businessData.cityId) || null
  }
  onChange={(val) => handleSelect("city", val)}
  styles={customStyles}
  isSearchable
/>

        <input
          type="text"
          name="district"
          placeholder="District *"
          value={businessData.district}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="state"
          placeholder="State *"
          value={businessData.state}
          readOnly
          className="border px-3 py-2 rounded bg-gray-100"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone *"
          value={businessData.phone}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp"
          value={businessData.whatsapp}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="website"
          placeholder="Website"
          value={businessData.website}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={businessData.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Business"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddBusiness;