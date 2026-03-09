import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext"; // assume you have auth context

const AddBusiness = () => {
  const { user } = useContext(AuthContext); // check user role
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    category: "",
    contact: "",
    address: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch cities and categories
  const fetchDropdowns = async () => {
    try {
      const [citiesRes, categoriesRes] = await Promise.all([
        API.get("/cities"),
        API.get("/categories"),
      ]);
      setCities(citiesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit business
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only admin or superadmin
    if (!["admin", "superadmin"].includes(user.role)) {
      return alert("You are not authorized to add businesses");
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      setLoading(true);
      await API.post("/business", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      alert("Business added successfully");
      // Reset form
      setFormData({
        name: "",
        description: "",
        city: "",
        category: "",
        contact: "",
        address: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to add business");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add New Business</h2>

      <form className="add-business-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Business Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Business Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Preview"
            style={{ width: "150px", margin: "10px 0" }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Business"}
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;