import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ProviderAnalytics = () => {
  const { user } = useAuth(); // get logged-in provider
  const [stats, setStats] = useState({
    views: 0,
    calls: 0,
    whatsapp: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.token) return; // don't fetch if not logged in

    try {
      const res = await API.get("/provider/analytics", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Provide defaults in case API does not send certain fields
      setStats({
        views: res.data.stats?.views || 0,
        calls: res.data.stats?.calls || 0,
        whatsapp: res.data.stats?.whatsapp || 0,
        leads: res.data.stats?.leads || 0,
      });
    } catch (err) {
      console.error("Error fetching provider analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) return <p className="p-10">Loading analytics...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="border p-4 rounded text-center">
          <h2 className="text-3xl font-bold">{stats.views}</h2>
          <p className="text-gray-500">Listing Views</p>
        </div>

        <div className="border p-4 rounded text-center">
          <h2 className="text-3xl font-bold">{stats.calls}</h2>
          <p className="text-gray-500">Call Clicks</p>
        </div>

        <div className="border p-4 rounded text-center">
          <h2 className="text-3xl font-bold">{stats.whatsapp}</h2>
          <p className="text-gray-500">WhatsApp Clicks</p>
        </div>

        <div className="border p-4 rounded text-center">
          <h2 className="text-3xl font-bold">{stats.leads}</h2>
          <p className="text-gray-500">Leads Received</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;