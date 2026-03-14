import React, { useEffect, useState } from "react";
import Select from "react-select";
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

      const categoryOptions = (catRes.data.categories || []).map((cat) => ({
        value: cat._id,
        label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
      }));

      const cityOptions = (cityRes.data.cities || []).map((city) => ({
  value: city.name,
  label: city.name,
  district: city.district,
  state: city.state,
}));

      setCategories(categoryOptions);
      setCities(cityOptions);

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

        {/* Category Search Dropdown */}
        <Select
          placeholder="Search Category *"
          options={categories}
          value={categories.find(c => c.value === businessData.category) || null}
          onChange={(selected) =>
            setBusinessData({
              ...businessData,
              category: selected.value,
            })
          }
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

        {/* City Search Dropdown */}
        <Select
  placeholder="Search City *"
  options={cities}
  value={cities.find((c) => c.value === businessData.city) || null}
  onChange={(selected) =>
    setBusinessData({
      ...businessData,
      city: selected.value,
      state: selected.state || "",
    })
  }
/>

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
          readOnly
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