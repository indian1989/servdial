import { useState, useContext } from "react";
import axios from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";

const AddCity = () => {
  const { user } = useContext(AuthContext);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!city || !state) return setError("City and State are required");

    try {
      // ⚡ Important: Send { name, state } instead of { city, state }
      const res = await axios.post(
        "/api/admin/city",       // Make sure route is /city in backend
        { name: city, state },   
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSuccess(`${res.data.city.name} added successfully!`);
      setCity("");
      setState("");
    } catch (err) {
      console.log(err.response?.data); // For debugging
      setError(err.response?.data?.message || "Failed to add city");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add City</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">City Name</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add City
        </button>
      </form>
    </div>
  );
};

export default AddCity;