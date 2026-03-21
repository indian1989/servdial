import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/settings");
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put("/admin/settings", settings);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">System Settings</h1>

      {Object.keys(settings).map((key) => (
        <div key={key} className="flex flex-col">
          <label className="font-semibold">{key}</label>
          <input
            type="text"
            name={key}
            value={settings[key]}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default SystemSettings;