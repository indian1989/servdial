import { useState } from "react";
import API from "../../api/axios";

const ProviderSettings = () => {

  const user = JSON.parse(localStorage.getItem("servdial_user"));

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/profile", form);
      alert("Profile updated");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/password", { password });
      alert("Password updated");
      setPassword("");
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Account Settings
      </h1>

      {/* PROFILE */}
      <form onSubmit={updateProfile} className="space-y-4 mb-10">

        <h2 className="text-lg font-semibold">
          Update Profile
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Update Profile
        </button>

      </form>

      {/* PASSWORD */}
      <form onSubmit={updatePassword} className="space-y-4">

        <h2 className="text-lg font-semibold">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Update Password
        </button>

      </form>

    </div>
  );
};

export default ProviderSettings;