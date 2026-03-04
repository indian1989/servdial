import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AddBusiness = () => {
  const { user } = useContext(AuthContext);
  const { addBusiness } = useContext(BusinessContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    city: "",
    district: "",
    state: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user || !["provider", "admin", "superadmin"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Access Denied
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const businessData = { ...formData };

      // Add to context
      addBusiness(businessData);

      // Send to backend
      await axios.post("/api/business", businessData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("Business submitted for admin approval!");

      // Reset form (IMPORTANT: include district & state)
      setFormData({
        name: "",
        category: "",
        address: "",
        city: "",
        district: "",
        state: "",
        phone: "",
        description: "",
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Add Your Business
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {[
            "name",
            "category",
            "address",
            "city",
            "district",   // ✅ added
            "state",      // ✅ added
            "phone",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Business"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddBusiness;