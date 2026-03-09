import { useState } from "react";
import axios from "../../api/axios";

const AddAdmin = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // default role
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      const res = await axios.post("/admins", formData);
      setLoading(false);
      alert(`Admin created successfully! Admin ID: ${res.data._id}`);
      
      // Reset form
      setFormData({ name: "", email: "", password: "", role: "admin" });

      // Callback to refresh list in parent if needed
      if (onAdded) onAdded();
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to add admin");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add New Admin</h2>

      <form className="add-admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;