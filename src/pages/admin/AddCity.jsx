import React, { useState, useEffect } from "react";
import {
  getAllCities,
  addCity,
  deleteCity,
} from "../../api/adminAPI";
import Loader from "../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const AddCity = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cityName, setCityName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  // ================= FETCH =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      setCities(res.data?.cities || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= ADD =================
  const handleAddCity = async () => {
    const city = cityName.trim();
    const dist = district.trim();
    const st = state.trim();

    if (!city || !dist || !st) {
      return alert("City, district and state are required.");
    }

    setLoading(true);

    try {
      // 🔥 DEBUG (remove later if you want)
      console.log("Sending:", {
        name: city,
        district: dist,
        state: st,
      });

      await addCity({
        name: city,
        district: dist,
        state: st,
      });

      setCityName("");
      setDistrict("");
      setState("");

      fetchCities();
    } catch (err) {
  console.error("FULL ERROR:", err);
  console.error("BACKEND ERROR:", err?.response?.data);

  alert(err?.response?.data?.message || "Failed to add city");
}
  };

  // ================= DELETE =================
  const handleDeleteCity = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    setLoading(true);

    try {
      await deleteCity(id);
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to delete city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add City</h2>

      {loading && <Loader />}

      {/* ADD FORM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 items-stretch">

        <input
          type="text"
          placeholder="City Name *"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="District *"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="State *"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Add City
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-3 py-2">City</th>
              <th className="border px-3 py-2">District</th>
              <th className="border px-3 py-2">State</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {cities.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No cities found
                </td>
              </tr>
            )}

            {cities.map((city) => (
              <tr key={city._id} className="text-center">
                <td className="border px-3 py-2">{city.name}</td>
                <td className="border px-3 py-2">{city.district}</td>
                <td className="border px-3 py-2">{city.state}</td>

                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDeleteCity(city._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 mx-auto"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AddCity;