// frontend/src/pages/admin/AdminAddBusiness.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { addBusiness, getAllCategories } from "../../api/adminAPI";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { buildCategoryTree } from "../../utils/adminUtils";

// 🔥 Flatten category tree
const flattenCategories = (tree = [], parentName = "") => {
  let result = [];

  tree.forEach((cat) => {
    const hasChildren = (cat.subcategories || []).length > 0;

    if (!hasChildren) {
      result.push({
        value: cat._id,
        label: parentName
          ? `${cat.name} (${parentName})` // ✅ CLEAN CONTEXT
          : cat.name,
      });
    }

    if (hasChildren) {
      result = result.concat(
        flattenCategories(cat.subcategories, cat.name)
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
  district: "",
  state: "",
  stateSlug: "",
  districtSlug: "",
  pincode: "",
  phone: "",
  whatsapp: "",
  website: "",
  description: "",
});

  const [error, setError] = useState("");

  const categoryMap = React.useMemo(() => {
  const map = {};
  categoryOptions.forEach(c => {
    map[c.value] = c;
  });
  return map;
}, [categoryOptions]);

const cityMap = React.useMemo(() => {
  const map = {};
  cities.forEach(c => {
    map[c.value] = c;
  });
  return map;
}, [cities]);

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

  if (name === "phone" || name === "whatsapp" || name === "pincode") {
  const clean = value.replace(/\D/g, "").slice(0, name === "pincode" ? 6 : 10);
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
      city: selected.value,
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
  const { name, categoryId, city, phone, pincode } = businessData;

  if (!name || !categoryId || !city || !phone) {
    return "Please fill all required fields";
  }

  if (phone.length !== 10) {
    return "Phone must be 10 digits";
  }

  if (pincode && pincode.length !== 6) {
  return "Pincode must be 6 digits";
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

  if (!businessData.categoryId) {
  return setError("Category is required");
}

  setError("");
  setLoading(true);

  try {
    await addBusiness({
      ...businessData,
      categoryId: businessData.categoryId,
      city: businessData.city,
      phone: businessData.phone.trim(),
      whatsapp: businessData.whatsapp || businessData.phone,
    });

    alert("Business added successfully!");

    setBusinessData({
      name: "",
      categoryId: "",
      address: "",
      city: "",
      district: "",
      state: "",
      stateSlug: "",
      districtSlug: "",
      pincode: "",
      phone: "",
      whatsapp: "",
      website: "",
      description: "",
    });

  } catch (err) {
  console.log("AXIOS ERROR OBJECT:", err);

  if (err.response) {
    console.log("STATUS:", err.response.status);
    console.log("DATA:", err.response.data);
    console.log("SENDING PAYLOAD:", businessData);
    console.log("ERROR FULL:", err.response);
    console.log("BODY:", businessData);
console.log("city field:", businessData.city);
console.log("cityId field:", businessData.cityId);
const sanitized = sanitizeBusinessInput(req.body, req.user);

console.log("RAW BODY:", req.body);
console.log("SANITIZED OUTPUT:", sanitized);
  } else if (err.request) {
    console.log("NO RESPONSE RECEIVED:", err.request);
  } else {
    console.log("ERROR MESSAGE:", err.message);
  }

  setError(
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Failed to add business"
  );
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
  categoryOptions.find(c => c.value === businessData.categoryId) || null
}
  onChange={(val) => handleSelect("categoryId", val)}
  styles={customStyles}
  isSearchable
  filterOption={(option, input) =>
  option.label.toLowerCase().includes(input.toLowerCase())
}
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
  cities.find(c => c.value === businessData.city) || null
}
  onChange={(val) => handleSelect("city", val)}
  styles={customStyles}
  isSearchable
/>

        {/* SYSTEM-DRIVEN LOCATION (NOT EDITABLE) */}
<div className="grid grid-cols-2 gap-2">
  <input
    value={businessData.district}
    readOnly
    className="border px-3 py-2 rounded bg-gray-100"
    placeholder="District (auto)"
  />

  <input
    value={businessData.state}
    readOnly
    className="border px-3 py-2 rounded bg-gray-100"
    placeholder="State (auto)"
  />
</div>

        <input
  type="text"
  name="pincode"
  placeholder="Pincode (6 digits)"
  value={businessData.pincode}
  onChange={handleChange}
  className="border px-3 py-2 rounded"
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