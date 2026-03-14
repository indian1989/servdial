import { useState, useEffect } from "react";
import axios from "../../api/axios";
import Select from "react-select";

const AddBusiness = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [businessData, setBusinessData] = useState({
    name: "",
    category: "",
    city: "",
    district: "",
    state: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH CATEGORIES & CITIES =================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const catRes = await axios.get("/categories");
      const cityRes = await axios.get("/cities");

      const categoryOptions = (catRes.data.categories || []).map((cat) => ({
        value: cat.name,
        label: cat.name,
      }));

      const cityOptions = (cityRes.data.cities || []).map((city) => ({
        value: city.name,
        label: city.name,
        district: city.district,
        state: city.state,
      }));

      setCategories(categoryOptions);
      setCities(cityOptions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBusinessData({
      ...businessData,
      [name]: value,
    });
  };

  // ================= HANDLE LOGO =================

  const handleLogoChange = (e) => {
    setBusinessData({
      ...businessData,
      logo: e.target.files[0],
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(businessData).forEach((key) => {
        formData.append(key, businessData[key]);
      });

      await axios.post("/businesses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Business added successfully");

      setBusinessData({
        name: "",
        category: "",
        city: "",
        district: "",
        state: "",
        phone: "",
        address: "",
        website: "",
        description: "",
        logo: null,
      });

    } catch (error) {
      console.error(error);
      alert("Error adding business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Add Business
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        {/* BUSINESS NAME */}
        <input
          type="text"
          name="name"
          placeholder="Business Name *"
          value={businessData.name}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />

        {/* CATEGORY */}
<Select
  placeholder="Search Category *"
  options={categories.map((c) => ({
    value: c._id,
    label: c.name,
  }))}
  value={
    categories
      .map((c) => ({ value: c._id, label: c.name }))
      .find((c) => c.value === businessData.category) || null
  }
  onChange={(selected) =>
    setBusinessData({
      ...businessData,
      category: selected.value,
    })
  }
/>

        {/* CITY */}
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

        {/* DISTRICT */}
        <input
          type="text"
          name="district"
          placeholder="District"
          value={businessData.district}
          onChange={handleChange}
          className="border px-3 py-2 rounded bg-gray-100"
        />

        {/* STATE */}
        <input
          type="text"
          name="state"
          placeholder="State"
          value={businessData.state}
          readOnly
          className="border px-3 py-2 rounded bg-gray-100"
        />

        {/* PHONE */}
        <input
          type="text"
          name="phone"
          placeholder="Phone *"
          value={businessData.phone}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />

        {/* WEBSITE */}
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={businessData.website}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* ADDRESS */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={businessData.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />

        {/* LOGO */}
        <input
          type="file"
          onChange={handleLogoChange}
          className="border px-3 py-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={businessData.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded md:col-span-2"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded md:col-span-2"
        >
          {loading ? "Adding..." : "Add Business"}
        </button>

      </form>

    </div>
  );
};

export default AddBusiness;