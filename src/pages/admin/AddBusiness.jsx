// Path: src/pages/admin/businesses/AddBusiness.jsx

import React, { useEffect, useState } from "react";
import { addBusiness, getCategories, getCities } from "../../api/adminAPI";
import Loader from "../../components/common/Loader";

const AddBusiness = () => {

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
    description: "",
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const catRes = await getCategories();
      const cityRes = await getCities();

      setCategories(catRes.data.categories || []);
      setCities(cityRes.data.cities || []);

    } catch (err) {
      console.error("Failed to load data", err);
    }

  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setBusinessData({
      ...businessData,
      [name]: value,
    });

  };

  // ================= SUBMIT =================
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
        description: "",
      });

    } catch (err) {

      console.error(err);
      alert("Failed to add business");

    } finally {

      setLoading(false);

    }

  };

  // ================= UI =================
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

        {/* Category Dropdown */}
        <select
          name="category"
          value={businessData.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Category *</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}

        </select>

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={businessData.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* City Dropdown */}
        <select
          name="city"
          value={businessData.city}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select City *</option>

          {cities.map((city) => (
            <option key={city._id} value={city.name}>
              {city.name}
            </option>
          ))}

        </select>

        {/* District */}
        <input
          type="text"
          name="district"
          placeholder="District *"
          value={businessData.district}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* State */}
        <input
          type="text"
          name="state"
          placeholder="State *"
          value={businessData.state}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
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
        >
          Add Business
        </button>

      </form>

    </div>

  );

};

export default AddBusiness;