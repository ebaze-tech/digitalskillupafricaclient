import { useState, useEffect } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUserForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "mentee",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log(id);
  if (!id) {
    return <p className="text-red-500">Invalid or missing user ID.</p>;
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/admin/user/${id}`);
        setFormData({
          username: data.username,
          email: data.email,
          password: "",
          role: data.role,
        });
      } catch (err) {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/admin/edit-user/${id}`, formData);
      toast.success("User updated successfully");
      navigate("/dashboard/users");
    } catch (error: any) {
      const message = error?.response?.data?.error || "Error updating user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-black shadow rounded"
    >
      <h2 className="text-lg font-bold">Edit User</h2>

      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full border px-3 py-2 rounded "
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="New Password (optional)"
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="mentor">Mentor</option>
        <option value="mentee">Mentee</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update User"}
      </button>
    </form>
  );
}
