// frontend/src/pages/admin/SystemSettings.jsx

import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const DEFAULT_SETTINGS = {
  siteName: "",
  siteLogo: "",
  contactEmail: "",
  contactPhone: "",
  maintenanceMode: false,
  footerText: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  },
};

const SystemSettings = () => {
  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        const res =
          await API.get("/admin/system-settings");

        const data =
          res.data?.data;

        // API array return कर रही है
        const serverSettings =
          Array.isArray(data)
            ? data[0]
            : data;

        setSettings({
          ...DEFAULT_SETTINGS,
          ...(serverSettings || {}),
          socialLinks: {
            ...DEFAULT_SETTINGS.socialLinks,
            ...(serverSettings?.socialLinks || {}),
          },
        });

      } catch (err) {
        console.error(
          "Failed to fetch system settings:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
  setError("");
  setSuccessMessage("");

  // Frontend validation
  if (!settings.contactEmail?.trim()) {
    setError("Contact Email is required.");
    return;
  }

  try {
    setSaving(true);

    const res = await API.put(
      "/admin/system-settings",
      {
        ...settings,
        contactEmail: settings.contactEmail.trim(),
      }
    );

    setSuccessMessage(
      res.data?.message ||
        "System settings updated successfully."
    );

  } catch (err) {
    console.error(
      "Failed to save system settings:",
      err
    );

    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to save settings."
    );

  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          System Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your website settings.
        </p>

        {error && (
  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
    {error}
  </div>
)}

{successMessage && (
  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
    {successMessage}
  </div>
)}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Site Name
          </label>

          <input
            type="text"
            name="siteName"
            value={settings.siteName || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Site Logo
          </label>

          <input
            type="text"
            name="siteLogo"
            value={settings.siteLogo || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Contact Email
          </label>

          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail || ""}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Contact Phone
          </label>

          <input
            type="text"
            name="contactPhone"
            value={settings.contactPhone || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Footer Text
          </label>

          <textarea
            name="footerText"
            value={settings.footerText || ""}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="maintenanceMode"
            checked={
              Boolean(
                settings.maintenanceMode
              )
            }
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                maintenanceMode:
                  e.target.checked,
              }))
            }
          />

          <label className="text-sm font-semibold text-gray-700">
            Maintenance Mode
          </label>

        </div>

        <div className="border-t border-gray-200 pt-5">

          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Social Links
          </h2>

          <div className="space-y-3">

            {[
              "facebook",
              "twitter",
              "instagram",
              "linkedin",
            ].map((social) => (

              <div key={social}>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {social.charAt(0).toUpperCase() +
                    social.slice(1)}
                </label>

                <input
                  type="text"
                  name={social}
                  value={
                    settings.socialLinks?.[
                      social
                    ] || ""
                  }
                  onChange={handleSocialChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />

              </div>

            ))}

          </div>

        </div>

        <div className="border-t border-gray-200 pt-5">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default SystemSettings;