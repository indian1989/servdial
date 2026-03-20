import React, { useEffect, useState } from "react";
import Select from "react-select";
import { addBusiness } from "../../api/adminAPI";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const AdminAddBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [businessData, setBusinessData] = useState({
    name: "",
    category: "",
    address: "",
    city: "",
    district: "",
    state: "",
    phone: "",
    whatsapp: "",
    website: "",
    description: "",
  });

  // ================= LOAD CATEGORIES & CITIES =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get("/admin/categories"),
          API.get("/admin/cities"),
        ]);

        const categoryOptions = (catRes.data.categories || []).map((cat) => ({
          value: cat._id,
          label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        }));

        const cityOptions = (cityRes.data.cities || []).map((c) => ({
          value: c.name,
          label: c.name,
          district: c.district || "",
          state: c.state || "",
        }));

        setCategories(categoryOptions);
        setCities(cityOptions);
      } catch (err) {
        console.error("Failed to load categories or cities", err);
      }
    };
    fetchData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({ ...businessData, [name]: value });
  };

  const handleSelect = (field, selected) => {
    if (!selected) return setBusinessData({ ...businessData, [field]: "" });
    if (field === "city") {
      setBusinessData({
        ...businessData,
        city: selected.value,
        district: selected.district,
        state: selected.state,
      });
    } else {
      setBusinessData({ ...businessData, [field]: selected.value });
    }
  };

  // ================= SUBMIT BUSINESS =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, category, city, district, state, phone } = businessData;
    if (!name || !category || !city || !district || !state || !phone) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    try {
      await addBusiness(businessData);
      alert("Business added successfully!");
      setBusinessData({
        name: "",
        category: "",
        address: "",
        city: "",
        district: "",
        state: "",
        phone: "",
        whatsapp: "",
        website: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Business</h2>

      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="grid gap-4">

        {/* Business Name */}
        <input
          type="text"
          name="name"
          placeholder="Business Name *"
          value={businessData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* Category */}
        <Select
          placeholder="Select Category *"
          options={categories}
          value={categories.find(c => c.value === businessData.category) || null}
          onChange={(val) => handleSelect("category", val)}
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={businessData.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* City */}
        <Select
          placeholder="Select City *"
          options={cities}
          value={cities.find(c => c.value === businessData.city) || null}
          onChange={(val) => handleSelect("city", val)}
        />

        {/* District */}
        <input
          type="text"
          name="district"
          placeholder="District *"
          value={businessData.district}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          readOnly
        />

        {/* State */}
        <input
          type="text"
          name="state"
          placeholder="State *"
          value={businessData.state}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          readOnly
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone *"
          value={businessData.phone}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* WhatsApp */}
        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp"
          value={businessData.whatsapp}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* Website */}
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={businessData.website}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* Description */}
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