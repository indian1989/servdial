import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/activity-logs");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activity Logs</h1>

      <input
        type="text"
        placeholder="Search by user or action..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full md:w-1/2"
      />

      <div className="overflow-x-auto mt-2">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{log.user}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.time}</td>
                <td className="p-2 border">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;