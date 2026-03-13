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
  const [state, setState] = useState("");

  // ================= FETCH CITIES =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      setCities(res.data);
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

  // ================= ADD CITY =================
  const handleAddCity = async () => {

    if (!cityName || !state) {
      return alert("City name and state are required.");
    }

    setLoading(true);

    try {

      await addCity({
        name: cityName,
        state: state,
      });

      setCityName("");
      setState("");

      fetchCities();

    } catch (err) {

      console.error(err);
      alert("Failed to add city.");

    } finally {
      setLoading(false);
    }

  };

  // ================= DELETE CITY =================
  const handleDeleteCity = async (id) => {

    if (!window.confirm("Are you sure you want to delete this city?")) return;

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
    <div className="p-6 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Add City</h2>

      {loading && <Loader />}

      {/* Add City */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">

        <input
          type="text"
          placeholder="City Name *"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="State *"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add City
        </button>

      </div>

      {/* Cities Table */}
      <div className="overflow-x-auto">

        <table className="w-full border-collapse border border-gray-200">

          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-3 py-2">City</th>
              <th className="border px-3 py-2">State</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>

            {cities.map((city) => (
              <tr key={city._id} className="text-center">

                <td className="border px-3 py-2">{city.name}</td>

                <td className="border px-3 py-2">{city.state}</td>

                <td className="border px-3 py-2 flex justify-center gap-2">

                  <button
                    onClick={() => handleDeleteCity(city._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
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