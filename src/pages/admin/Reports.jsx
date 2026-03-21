import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/reports"); // Replace with your endpoint
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportCSV = () => {
    if (!reports.length) return;
    const header = Object.keys(reports[0]).join(",");
    const rows = reports.map(r => Object.values(r).join(",")).join("\n");
    const csv = [header, rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports.csv";
    link.click();
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <button
        onClick={exportCSV}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export CSV
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded mt-2">
          <thead className="bg-gray-100">
            <tr>
              {reports.length > 0 &&
                Object.keys(reports[0]).map((key) => (
                  <th key={key} className="p-2 text-left border">{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(report).map((val, i) => (
                  <td key={i} className="p-2 border">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;