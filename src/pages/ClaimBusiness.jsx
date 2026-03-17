import { useParams } from "react-router-dom";
import { useState } from "react";

function ClaimBusiness() {
  const { businessId } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/claims", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, businessId }),
    });

    alert("Claim submitted successfully!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">

      <h1 className="text-2xl font-bold mb-6">
        Claim This Business
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Explain why you own this business"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
        >
          Submit Claim
        </button>

      </form>

    </div>
  );
}

export default ClaimBusiness;