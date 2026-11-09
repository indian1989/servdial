// src/pages/admin/ManageCities.jsx

import React, { useState, useEffect } from "react";
import {
  getAllCities,
  addCity,
  updateCity,
  deleteCity,
  bulkUploadCities,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";
import { FaTrash, FaEdit } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";

const PAGE_SIZE = 15;

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importReport, setImportReport] = useState(null);
  // ================= CITY EXPORT FILTERS =================
  const [exportState, setExportState] = useState("all");
  const [exportDistrict, setExportDistrict] = useState("all");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ================= ADD FORM =================
  const [form, setForm] = useState({
    name: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");

  // ================= EDIT =================
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    district: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  // ================= DROPDOWN OPTIONS =================
const getOptions = (key) => {
  const unique = [...new Set(cities.map((c) => c[key]).filter(Boolean))];

  return unique.map((v) => ({
    label: v,
    value: v,
  }));
};

// ================= FIND CITY DATA =================
const getCityDetails = (cityName) => {
  if (!cityName) return null;

  const normalized = cityName.toLowerCase().trim();

  return cities.find(
    (c) =>
      c.name?.toLowerCase().trim() === normalized ||
      c.name?.toLowerCase().includes(normalized)
  );
};

// ================= TOGGLE FEATURED =================
const toggleFeatured = async (city) => {
  try {
    await updateCity(city._id, {
      isFeatured: !city.isFeatured,
    });

    fetchCities(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Failed to update featured status");
  }
};

// ================= TOGGLE CITY STATUS =================
const toggleCityStatus = async (city) => {
  const nextStatus = city.status === "active" ? "inactive" : "active";

  const confirmed = window.confirm(
    nextStatus === "inactive"
      ? `Deactivate "${city.name}"?\n\nThis city will no longer be available as an active public city.`
      : `Activate "${city.name}"?\n\nThis city will become publicly available again.`
  );

  if (!confirmed) return;

  try {
    await updateCity(city._id, {
      status: nextStatus,
    });

    fetchCities();
  } catch (err) {
    console.error(err);
    alert(
      nextStatus === "inactive"
        ? "Failed to deactivate city"
        : "Failed to activate city"
    );
  }
};

  // ================= FETCH =================
  const fetchCities = async () => {
  setLoading(true);
  try {
    const res = await getAllCities();

    console.log("🔥 FULL RESPONSE:", res);
    console.log("🔥 DATA:", res.data);

    setCities(res.data?.data || []);
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    alert("Failed to fetch cities");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= COORDINATES =================
  const fetchCoordinates = async (name, district, state) => {
  try {
    const query = `${name}, ${district}, ${state}, India`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("Geo error:", err);
    return null;
  }
};

// ================= FETCH CITY DETAILS =================
const fetchCityMeta = async (name) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(name)}`
    );

    const data = await res.json();

    if (data && data.length > 0) {
      const addr = data[0].address;

      return {
        district:
          addr.state_district ||
          addr.county ||
          addr.city_district ||
          "",
        state: addr.state || "",
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("City meta error:", err);
    return null;
  }
};

// ================= ADD CITY =================
const handleAddCity = async () => {
  if (!form.name || !form.district || !form.state) {
    return setError("City, district, state required");
  }

  setLoading(true);
  setError("");

  try {
    let lat = Number(form.latitude);
    let lng = Number(form.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      const coords = await fetchCoordinates(
        form.name,
        form.district,
        form.state
      );

      if (!coords) {
        setError("Coordinates not found");
        setLoading(false);
        return;
      }

      lat = coords.lat;
      lng = coords.lng;
    }

    await addCity({
      name: form.name,
      district: form.district,
      state: form.state,
      country: "India",
      latitude: lat,
      longitude: lng,
    });

    setForm({
      name: "",
      district: "",
      state: "",
      latitude: "",
      longitude: "",
    });

    fetchCities();
  } catch (err) {
    console.error(err);
    alert("Add failed");
  } finally {
    setLoading(false);
  }
};

  // ================= UPDATE CITY =================
  const handleUpdateCity = async (id) => {
  if (!editForm.name || !editForm.district || !editForm.state) {
    return alert("All fields required");
  }

  setLoading(true);

  try {
    let lat = Number(editForm.latitude);
    let lng = Number(editForm.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      const coords = await fetchCoordinates(
        editForm.name,
        editForm.district,
        editForm.state
      );

      if (!coords) {
        alert("Coordinates not found");
        setLoading(false);
        return;
      }

      lat = coords.lat;
      lng = coords.lng;
    }

    await updateCity(id, {
      name: editForm.name,
      district: editForm.district,
      state: editForm.state,
      latitude: lat,
      longitude: lng,
    });

    setEditId(null);
    fetchCities();
  } catch (err) {
    console.error(err);
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    setLoading(true);
    try {
      await deleteCity(id);
      fetchCities();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= BULK UPLOAD =================
const handleBulk = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  setImportReport(null);

  try {
    const text = await file.text();

    // Keep original CSV row numbers.
    const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/);

    const processed = [];
    const clientFailures = [];

    // Skip header row (CSV row 1).
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();

      // Ignore completely empty lines.
      if (!row) continue;

      const csvRow = i + 1;
      const [rawName, rawDistrict, rawState, rawLat, rawLng] =
        row.split(",");

      const name = rawName?.trim();
      const district = rawDistrict?.trim();
      const state = rawState?.trim();

      // Mandatory field validation.
      if (!name || !district || !state) {
        clientFailures.push({
          row: csvRow,
          name: name || "Unknown",
          status: "failed",
          reason: "City name, district and state are required",
        });
        continue;
      }

      let latitude =
        rawLat?.trim() !== "" ? Number(rawLat) : NaN;

      let longitude =
        rawLng?.trim() !== "" ? Number(rawLng) : NaN;

      // Fetch coordinates if missing or invalid.
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        const coords = await fetchCoordinates(
          name,
          district,
          state
        );

        if (!coords) {
          clientFailures.push({
            row: csvRow,
            name,
            status: "failed",
            reason: "Valid coordinates not found",
          });
          continue;
        }

        latitude = coords.lat;
        longitude = coords.lng;
      }

      processed.push({
        name,
        district,
        state,
        latitude,
        longitude,
        csvRow,
      });
    }

    // If every row failed frontend validation/geocoding,
    // still show the import report.
   if (processed.length === 0) {
  setImportReport({
    total: clientFailures.length,
    inserted: 0,
    skipped: 0,
    failed: clientFailures.length,
    importedAt: new Date().toISOString(),
    results: clientFailures,
  });

      return;
    }

    // Upload valid rows to backend.
    const response = await bulkUploadCities({
      cities: processed,
    });

    const data = response?.data || {};

    if (!data.success) {
      throw new Error(data.message || "Bulk upload failed");
    }

    const serverResults = Array.isArray(data.results)
      ? data.results
      : [];

    const allResults = [
      ...serverResults,
      ...clientFailures,
    ].sort((a, b) => (a.row || 0) - (b.row || 0));

    const totalRows =
      processed.length + clientFailures.length;

    setImportReport({
  total: totalRows,
  inserted: Number(data.inserted) || 0,
  skipped: Number(data.skipped) || 0,
  failed:
    (Number(data.failed) || 0) + clientFailures.length,
  importedAt: new Date().toISOString(),
  results: allResults,
});

    await fetchCities();
  } catch (err) {
    console.error("City bulk upload error:", err);
    alert(
      err.response?.data?.message ||
      err.message ||
      "Bulk upload failed"
    );
  } finally {
    setUploading(false);

    // Allow selecting the same file again.
    e.target.value = "";
  }
};

// ================= DOWNLOAD IMPORT REPORT =================
const downloadImportReport = () => {
  if (!importReport) return;

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const lines = [
    ["CSV Row", "City", "Status", "Details"]
      .map(escapeCsv)
      .join(","),

    ...importReport.results.map((item) =>
      [
        item.row,
        item.name,
        item.status,
        item.reason ||
          (item.status === "created"
            ? "Imported successfully"
            : item.status === "skipped"
            ? "Duplicate city skipped"
            : ""),
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ];

  const blob = new Blob(
    ["\uFEFF" + lines.join("\n")],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "city-import-report.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// ================= EXPORT CITY RECORDS =================

// Unique States
const exportStateOptions = [
  ...new Set(
    cities
      .map((city) => city.state?.trim())
      .filter(Boolean)
  ),
].sort((a, b) => a.localeCompare(b));

// Districts based on selected State
const exportDistrictOptions = [
  ...new Set(
    cities
      .filter(
        (city) =>
          exportState === "all" ||
          city.state?.trim().toLowerCase() ===
            exportState.toLowerCase()
      )
      .map((city) => city.district?.trim())
      .filter(Boolean)
  ),
].sort((a, b) => a.localeCompare(b));

// Filter records for export
const exportFilteredCities = cities.filter((city) => {
  const stateMatch =
    exportState === "all" ||
    city.state?.trim().toLowerCase() ===
      exportState.toLowerCase();

  const districtMatch =
    exportDistrict === "all" ||
    city.district?.trim().toLowerCase() ===
      exportDistrict.toLowerCase();

  return stateMatch && districtMatch;
});

// Download CSV
const downloadCityRecords = () => {
  if (exportFilteredCities.length === 0) {
    alert("No city records available for selected filters.");
    return;
  }

  const escapeCsv = (value) => {
    const safeValue = String(value ?? "");
    return `"${safeValue.replace(/"/g, '""')}"`;
  };

  const headers = [
    "name",
    "district",
    "state",
    "latitude",
    "longitude",
  ];

  const rows = exportFilteredCities.map((city) =>
    [
      city.name,
      city.district,
      city.state,
      city.latitude,
      city.longitude,
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csvContent = [
    headers.join(","),
    ...rows,
  ].join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;

  const safeName = (value) =>
    String(value)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "");

  const fileName =
    exportState === "all"
      ? "servdial-all-city-records.csv"
      : exportDistrict === "all"
      ? `servdial-${safeName(exportState)}-cities.csv`
      : `servdial-${safeName(exportState)}-${safeName(exportDistrict)}-cities.csv`;

  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  // ================= FILTER =================
  const filtered = (Array.isArray(cities) ? cities : []).filter((c) =>
    `${c.name} ${c.district} ${c.state}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= UI =================
 return (
  <div className="p-6 max-w-6xl mx-auto relative">

    <h2 className="text-2xl font-bold mb-4">Manage Cities</h2>

    {/* NON-BLOCKING LOADER */}
    {loading && (
      <div className="absolute top-2 right-2 text-sm text-gray-500">
        Loading...
      </div>
    )}

      {/* ================= ADD ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">

        <CreatableSelect
  placeholder="Select or type city"
  options={getOptions("name")}
  value={form.name ? { label: form.name, value: form.name } : null}
  onChange={async (selected) => {
  const cityName = selected?.value || "";

  // 🔥 1. Try DB first
  const cityData = getCityDetails(cityName);

  let updatedForm = {
    ...form,
    name: cityName,
    district: cityData?.district || "",
    state: cityData?.state || "",
  };

  setForm(updatedForm);

  // 🔥 2. If not found in DB → use geo autofill
  if (!cityData && cityName) {
    const meta = await fetchCityMeta(cityName);

    if (meta) {
      updatedForm = {
        ...updatedForm,
        district: meta.district || "",
        state: meta.state || "",
        latitude: meta.lat,
        longitude: meta.lng,
      };

      setForm(updatedForm);
      return;
    }
  }

  // 🔥 3. fallback → fetch coords
  if (updatedForm.name && updatedForm.district && updatedForm.state) {
    const coords = await fetchCoordinates(
      updatedForm.name,
      updatedForm.district,
      updatedForm.state
    );

    if (coords) {
      setForm((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
    }
  }
}}
/>

        <CreatableSelect
  placeholder="Select or type district"
  options={getOptions("district")}
  value={
    form.district ? { label: form.district, value: form.district } : null
  }
  onChange={async (selected) => {
  const district = selected?.value || "";

  const updated = { ...form, district };
  setForm(updated);

  if (updated.name && district && updated.state) {
    const coords = await fetchCoordinates(
      updated.name,
      district,
      updated.state
    );

    if (coords) {
      setForm((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
    }
  }
}}
/>

        <CreatableSelect
  placeholder="Select or type state"
  options={getOptions("state")}
  value={form.state ? { label: form.state, value: form.state } : null}
  onChange={async (selected) => {
    const newState = selected?.value || "";

    const updatedForm = { ...form, state: newState };
    setForm(updatedForm);

    // 🔥 AUTO COORDINATES
    if (updatedForm.name && updatedForm.district && newState) {
      const coords = await fetchCoordinates(
        updatedForm.name,
        updatedForm.district,
        newState
      );

      if (coords) {
        setForm((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }));
      }
    }
  }}
/>

        <input
  placeholder="Lat (auto)"
  value={form.latitude}
  disabled
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>

<input
  placeholder="Lng (auto)"
  value={form.longitude}
  disabled
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>

      </div>

      <button
        onClick={handleAddCity}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add City
      </button>

      {/* ================= BULK ================= */}
<div className="mb-4">
  <input
    type="file"
    accept=".csv"
    onChange={handleBulk}
    disabled={uploading}
    className="border p-2 rounded w-full sm:w-auto"
  />

  {uploading && (
    <p className="text-sm text-blue-600 mt-2">
      Uploading cities and generating import report...
    </p>
  )}
</div>

{/* ================= EXPORT CITY RECORDS ================= */}
<div className="mb-6 bg-white border rounded-xl shadow-sm p-4">

  <div className="mb-4">
    <h3 className="text-lg font-bold text-gray-800">
      Export City Records
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Download city records by State and District.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    {/* STATE FILTER */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select State
      </label>

      <select
        value={exportState}
        onChange={(e) => {
          setExportState(e.target.value);
          setExportDistrict("all");
        }}
        className="border rounded-lg p-2.5 w-full bg-white"
      >
        <option value="all">All States</option>

        {exportStateOptions.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>

    {/* DISTRICT FILTER */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select District
      </label>

      <select
        value={exportDistrict}
        onChange={(e) => setExportDistrict(e.target.value)}
        disabled={exportState === "all"}
        className="border rounded-lg p-2.5 w-full bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="all">All Districts</option>

        {exportDistrictOptions.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>

  </div>

  {/* EXPORT SUMMARY + DOWNLOAD */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t">

    <div>
      <p className="text-sm text-gray-600">
        Matching City Records
      </p>

      <p className="text-2xl font-bold text-gray-800">
        {exportFilteredCities.length}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {exportState === "all"
          ? "All States"
          : exportState}
        {" / "}
        {exportDistrict === "all"
          ? "All Districts"
          : exportDistrict}
      </p>
    </div>

    <button
      onClick={downloadCityRecords}
      disabled={
        exportFilteredCities.length === 0 || loading
      }
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Download City Records CSV
    </button>

  </div>

</div>

{/* ================= CITY IMPORT REPORT ================= */}
{importReport && (
  <div className="mb-6 bg-white border rounded-xl shadow-sm overflow-hidden">

    {/* REPORT HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b">
      <div>
        <h3 className="text-lg font-bold text-gray-800">
          City Import Report
        </h3>

        <p className="text-sm text-gray-500 mt-1">
  Import finished: {importReport.inserted} created,{" "}
  {importReport.skipped} skipped,{" "}
  {importReport.failed} failed.
</p>

<p className="text-xs text-gray-500 mt-1">
  Import Date & Time:{" "}
  {importReport.importedAt
    ? new Date(importReport.importedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium",
      })
    : "-"}
</p>
      </div>

      <button
        onClick={downloadImportReport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Download Report CSV
      </button>
    </div>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4">

      <div className="bg-gray-50 border rounded-lg p-3">
        <p className="text-xs text-gray-500">Total Rows</p>
        <p className="text-2xl font-bold text-gray-800">
          {importReport.total}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-700">Created</p>
        <p className="text-2xl font-bold text-green-700">
          {importReport.inserted}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-700">
          Skipped / Duplicates
        </p>
        <p className="text-2xl font-bold text-yellow-700">
          {importReport.skipped}
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-xs text-red-700">Failed</p>
        <p className="text-2xl font-bold text-red-700">
          {importReport.failed}
        </p>
      </div>

      {/* SUCCESS RATE */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
  <p className="text-xs text-blue-700">
    Success Rate
  </p>

  <p className="text-2xl font-bold text-blue-700">
    {importReport.total > 0
      ? (
          ((importReport.inserted + importReport.skipped) /
            importReport.total) *
          100
        ).toFixed(1)
      : "0.0"}
    %
  </p>

  <p className="text-xs text-blue-600 mt-1">
    Created + Skipped
  </p>
</div>

    </div>

    {/* ROW-WISE RESULTS */}
    <div className="px-4 pb-4">

      <h4 className="font-semibold text-gray-800 mb-3">
        Row-wise Results ({importReport.results.length})
      </h4>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600">
              <th className="p-3 whitespace-nowrap">CSV Row</th>
              <th className="p-3">City</th>
              <th className="p-3">Status</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>

          <tbody>
            {importReport.results.map((item, index) => (
              <tr
                key={`${item.row}-${index}`}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 whitespace-nowrap">
                  {item.row ?? "-"}
                </td>

                <td className="p-3 font-medium">
                  {item.name || "Unknown"}
                </td>

                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "created"
                        ? "bg-green-100 text-green-700"
                        : item.status === "skipped"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-3 text-gray-600">
                  {item.reason ||
                    (item.status === "created"
                      ? "Imported successfully"
                      : item.status === "skipped"
                      ? "Duplicate city skipped"
                      : "Import failed")}
                </td>
              </tr>
            ))}

            {importReport.results.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500"
                >
                  No row-wise results available.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>

  </div>
)}

      {/* ================= SEARCH ================= */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

  <div className="overflow-x-auto">
    <table className="w-full text-sm">

      {/* HEADER */}
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
          <th className="p-3">City</th>
          <th className="p-3">District</th>
          <th className="p-3">State</th>
          <th className="p-3">Latitude</th>
          <th className="p-3">Longitude</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3 text-center">Featured</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {paginated.map((c, index) => (
          <tr
            key={c._id}
            className={`border-t hover:bg-gray-50 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
            }`}
          >

            {/* CITY */}
            <td className="p-3 font-medium">
              {editId === c._id ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.name}
                  onBlur={async () => {
                    if (!editForm.name) return;

                    const meta = await fetchCityMeta(editForm.name);

                    if (meta) {
                      setEditForm((prev) => ({
                        ...prev,
                        district: meta.district || prev.district,
                        state: meta.state || prev.state,
                        latitude: meta.lat,
                        longitude: meta.lng,
                      }));
                    }
                  }}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              ) : (
                c.name
              )}
            </td>

            {/* DISTRICT */}
            <td className="p-3">
            {editId === c._id ? (
              <CreatableSelect
                options={getOptions("district")}
                value={
                  editForm.district
                    ? { label: editForm.district, value: editForm.district }
                    : null
                }
                onChange={(selected) =>
                  setEditForm({ ...editForm, district: selected?.value || "" })
                }
              />
            ) : (
              c.district
            )}
          </td>

            {/* STATE */}
            <td className="p-3">
            {editId === c._id ? (
              <CreatableSelect
                options={getOptions("state")}
                value={
                  editForm.state
                    ? { label: editForm.state, value: editForm.state }
                    : null
                }
                onChange={(selected) =>
                  setEditForm({ ...editForm, state: selected?.value || "" })
                }
              />
            ) : (
              c.state
            )}
          </td>

            {/* LAT */}
            <td className="p-3">
            {editId === c._id ? (
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={editForm.latitude}
                onChange={(e) =>
                  setEditForm({ ...editForm, latitude: e.target.value })
                }
              />
            ) : (
              c.latitude
            )}
          </td>

            {/* LNG */}
            <td className="p-3">
            {editId === c._id ? (
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={editForm.longitude}
                onChange={(e) =>
                  setEditForm({ ...editForm, longitude: e.target.value })
                }
              />
            ) : (
              c.longitude
            )}
          </td>

        {/* CITY STATUS */}
<td className="p-3 text-center">
  <button
    onClick={() => toggleCityStatus(c)}
    className={`px-3 py-1 rounded text-xs font-medium ${
      c.status === "active"
        ? "bg-green-600 text-white"
        : "bg-red-600 text-white"
    }`}
  >
    {c.status === "active" ? "Active" : "Inactive"}
  </button>
</td>

          {/* FEATURE TOGGLE */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleFeatured(c)}
                    className={`px-3 py-1 rounded text-xs ${
                      c.isFeatured
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {c.isFeatured ? "Featured" : "Mark Featured"}
                  </button>
                </td>

            {/* ACTIONS */}
            <td className="p-3">
              <div className="flex justify-center gap-2">

                {editId === c._id ? (
                  <>
                    <button
                      onClick={() => handleUpdateCity(c._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(c._id);
                        setEditForm({
                        ...c,
                        latitude: c.latitude ?? "",
                        longitude: c.longitude ?? "",
                      });
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}

              </div>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
    {/* ================= PAGINATION ================= */}
{filtered.length > PAGE_SIZE && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">

    {/* RESULT INFO */}
    <div className="text-sm text-gray-500">
      Showing{" "}
      {((currentPage - 1) * PAGE_SIZE) + 1}
      {" - "}
      {Math.min(currentPage * PAGE_SIZE, filtered.length)}
      {" of "}
      {filtered.length}
      {" cities"}
    </div>

    {/* PAGINATION BUTTONS */}
    <div className="flex items-center gap-2">

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        disabled={currentPage === 1}
        className="px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
        Page {currentPage} of{" "}
        {Math.ceil(filtered.length / PAGE_SIZE)}
      </span>

      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(
              prev + 1,
              Math.ceil(filtered.length / PAGE_SIZE)
            )
          )
        }
        disabled={
          currentPage === Math.ceil(filtered.length / PAGE_SIZE)
        }
        className="px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>

    </div>
  </div>
)}
  </div>

</div>

</div>
  );
};

export default ManageCities;