const LeadForm = ({
  business,
  leadData,
  setLeadData,
  loading = false,
  handleSubmit,
}) => {
  const updateField = (field, value) => {
    setLeadData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Get Best Deal from {business?.name}
      </h2>

      {/* Name */}

      <input
        type="text"
        placeholder="Your Name"
        value={leadData.name}
        onChange={(e) =>
          updateField("name", e.target.value)
        }
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Phone */}

      <input
        type="tel"
        placeholder="Phone Number"
        value={leadData.phone}
        onChange={(e) =>
          updateField("phone", e.target.value)
        }
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Message */}

      <textarea
        rows={4}
        placeholder="Describe your requirement..."
        value={leadData.message}
        onChange={(e) =>
          updateField("message", e.target.value)
        }
        className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Submit */}

      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

    </div>
  );
};

export default LeadForm;