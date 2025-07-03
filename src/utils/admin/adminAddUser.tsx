import { useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "mentee",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/admin/add-user", formData);
      toast.success("User created successfully");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "mentee",
      });
    } catch (error: any) {
      const message = error?.response?.data?.error || "Error creating user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
          Add New User
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
