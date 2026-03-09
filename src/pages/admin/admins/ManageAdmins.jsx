import { useEffect, useState } from "react";
import axios from "../../api/axios";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admins");
      setAdmins(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`/admins/${id}`);
      fetchAdmins();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Admins</h2>

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <button>Edit</button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteAdmin(admin._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageAdmins;````