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
      setFormData({ username: "", email: "", password: "", role: "mentee" });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Error creating user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-blue-400 shadow rounded"
    >
      <h2 className="text-lg font-bold">Add New User</h2>

      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="mentor">Mentor</option>
        <option value="mentee">Mentee</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
