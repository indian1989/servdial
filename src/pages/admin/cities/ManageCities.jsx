import { useEffect, useState } from "react";
import axios from "../../api/axios";

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState("");

  // Fetch cities
  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/cities");
      setCities(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Add City
  const addCity = async () => {
    if (!newCity.trim()) return alert("Enter city name");

    try {
      await axios.post("/cities", { name: newCity });
      setNewCity("");
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete City
  const deleteCity = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    try {
      await axios.delete(`/cities/${id}`);
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Cities</h2>

      <div className="add-city-form">
        <input
          type="text"
          placeholder="New city name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <button onClick={addCity}>Add City</button>
      </div>

      {loading ? (
        <p>Loading cities...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((city) => (
              <tr key={city._id}>
                <td>{city.name}</td>
                <td>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteCity(city._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCities;