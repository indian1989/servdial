import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`/categories/${editId}`, { name });
      setEditId(null);
    } else {
      await axios.post("/categories", { name });
    }

    setName("");
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Manage Categories</h2>

      {/* Add Category */}
      <form onSubmit={handleSubmit} className="mb-4">

        <div className="input-group">

          <input
            type="text"
            className="form-control"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button className="btn btn-primary">
            {editId ? "Update" : "Add"}
          </button>

        </div>

      </form>

      {/* Category List */}
      <table className="table table-bordered">

        <thead>
          <tr>
            <th>Category</th>
            <th width="200">Actions</th>
          </tr>
        </thead>

        <tbody>

          {categories.map((cat) => (
            <tr key={cat._id}>

              <td>{cat.name}</td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ManageCategories;