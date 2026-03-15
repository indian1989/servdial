import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Invalid or expired link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {message && <p className="mb-4 text-blue-600">{message}</p>}

        <input
          type="password"
          className="w-full border p-3 mb-4 rounded"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;