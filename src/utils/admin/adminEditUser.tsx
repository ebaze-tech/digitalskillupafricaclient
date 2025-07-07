import { useState, useEffect } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUserForm() {
  // Form data state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "mentee",
  });

  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Get user ID from route parameters
  const { id } = useParams<{ id: string }>();

  // Navigation after update
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const { data } = await API.get(`/admin/user/${id}`);
        setFormData({
          username: data.username,
          email: data.email,
          password: "", // Leave password empty
          role: data.role,
        });
      } catch (err) {
        toast.error("Failed to fetch user details.");
      }
    };
    fetchUser();
  }, [id]);

  // Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Email validation using regex
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form validation function
  const validateForm = () => {
    if (!formData.username.trim() || formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await API.put(`/admin/users/${id}/role`, formData);
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error: any) {
      const message = error?.response?.data?.error || "Error updating user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Show error if ID is invalid
  if (!id) {
    return (
      <p className="text-red-500 font-semibold text-center px-4 mt-6">
        Invalid or missing user ID.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Edit User
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave empty to keep unchanged"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Role Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white px-4 py-2 rounded text-sm sm:text-base cursor-pointer ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } transition-colors`}
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}
