import React, { useState, useEffect, useRef } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getAllCities,
  addCity,
  deleteCity,
  bulkUploadCities
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import { FaTrash } from "react-icons/fa";

const AddCity = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [cityName, setCityName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const [formError, setFormError] = useState(false);

  const fileRef = useRef();

  // ================= FETCH =================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await getAllCities();
      const data = res.data?.cities || [];
      setCities(data);

      // 🔥 City Options
      setCityOptions(
        data.map((c) => ({
          value: c.name,
          label: `${c.name} (${c.state})`,
          district: c.district,
          state: c.state,
        }))
      );

      // 🔥 Unique Districts
      setDistrictOptions([
        ...new Map(
          data.map((c) => [
            c.district,
            { value: c.district, label: c.district },
          ])
        ).values(),
      ]);

      // 🔥 Unique States
      setStateOptions([
        ...new Map(
          data.map((c) => [
            c.state,
            { value: c.state, label: c.state },
          ])
        ).values(),
      ]);

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
      setFormError(true);
      return alert("City, District and State are mandatory.");
    }

    setFormError(false);
    setLoading(true);

    try {
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
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  // ================= BULK UPLOAD =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const text = await file.text();

      const rows = text
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r !== "");

      if (rows.length <= 1) {
        alert("CSV is empty or invalid.");
        return;
      }

      const parsed = rows.slice(1).map((row) => {
        const cols = row.split(",");
        return {
          name: cols[0]?.trim(),
          district: cols[1]?.trim(),
          state: cols[2]?.trim(),
        };
      });

      const validCities = parsed.filter(
        (c) => c.name && c.district && c.state
      );

      if (validCities.length === 0) {
        alert("No valid rows found.");
        return;
      }

      const res = await bulkUploadCities({ cities: validCities });

      alert(`
✅ Inserted: ${res.data.inserted}
⏭ Skipped: ${res.data.skipped}
❌ Failed: ${res.data.failedCount}
      `);

      if (fileRef.current) fileRef.current.value = "";

      fetchCities();

    } catch (err) {
      console.error(err);
      alert("Bulk upload failed.");
    } finally {
      setUploading(false);
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

      {/* ================= ADD FORM ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">

        {/* CITY */}
        <CreatableSelect
          placeholder="City *"
          options={cityOptions}
          value={cityName ? { label: cityName, value: cityName } : null}
          onChange={(val) => {
            setCityName(val?.value || "");
            if (val?.district) setDistrict(val.district);
            if (val?.state) setState(val.state);
          }}
          onInputChange={(inputValue, actionMeta) => {
            if (actionMeta.action === "input-change") {
              setCityName(inputValue);
            }
          }}
          isClearable
        />

        {/* DISTRICT */}
        <CreatableSelect
          placeholder="District *"
          options={districtOptions}
          value={district ? { label: district, value: district } : null}
          onChange={(val) => setDistrict(val?.value || "")}
          onInputChange={(inputValue, actionMeta) => {
            if (actionMeta.action === "input-change") {
              setDistrict(inputValue);
            }
          }}
          isClearable
        />

        {/* STATE */}
        <CreatableSelect
          placeholder="State *"
          options={stateOptions}
          value={state ? { label: state, value: state } : null}
          onChange={(val) => setState(val?.value || "")}
          onInputChange={(inputValue, actionMeta) => {
            if (actionMeta.action === "input-change") {
              setState(inputValue);
            }
          }}
          isClearable
        />

        <button
          onClick={handleAddCity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>

      </div>

      {/* ================= BULK UPLOAD ================= */}
      <div className="mb-4 flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border px-3 py-2 rounded"
        />

        {uploading && (
          <span className="text-blue-500 font-medium">
            Uploading...
          </span>
        )}
      </div>

      {/* ================= TABLE ================= */}
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

            {cities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No cities found
                </td>
              </tr>
            ) : (
              cities.map((city) => (
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
              ))
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default AddCity;