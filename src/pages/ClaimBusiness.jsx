// frontend/src/pages/ClaimBusiness.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function ClaimBusiness() {
  const { businessId } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        `/businesses/${businessId}/claim`,
        form
      );

      alert(res.data?.message || "Claim submitted successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

    } catch (err) {
      console.error("Claim Error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to submit claim."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold mb-6">
        Claim This Business
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow rounded-lg p-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <textarea
          name="message"
          rows="5"
          placeholder="Explain why you own this business..."
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </button>

      </form>

    </div>
  );
}

export default ClaimBusiness;