import { useEffect, useState } from "react";
import axios from "../../api/axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock user
  const toggleBlock = async (user) => {
    try {
      await axios.put(`/users/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isBlocked ? (
                    <span style={{ color: "red" }}>Blocked</span>
                  ) : (
                    <span style={{ color: "green" }}>Active</span>
                  )}
                </td>
                <td>
                  <button onClick={() => toggleBlock(user)}>
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteUser(user._id)}
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

export default ManageUsers;