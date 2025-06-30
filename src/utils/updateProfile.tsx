import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios/axios";
import { useAuth } from "../authContext";
import { Loader2 } from "lucide-react";

export default function UpdateProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    shortBio: "",
    goals: "",
    skills: "",
    industry: "",
    experience: "",
    availability: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        shortBio: user.shortBio || "",
        goals: user.goals || "",
        skills: user.skills || "",
        industry: user.industry || "",
        experience: user.experience || "",
        availability: user.availability || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        shortBio: formData.shortBio,
        goals: formData.goals,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        industry: formData.industry,
        experience: formData.experience,
        availability: formData.availability,
      };

      await API.put(`/profile/setup`, payload);

      if (!user) throw new Error("User is not authenticated");

      const updatedUser = {
        ...user,
        ...payload,
        email: user.email,
        id: user.id,
        role: user.role,
        mentorId: user.mentorId,
        roleId: user.roleId,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser);

      toast.success("✅ Profile updated successfully");

      const redirectPath =
        user?.role === "mentor"
          ? "/dashboard/mentor"
          : user?.role === "mentee"
          ? "/dashboard/mentee"
          : "/dashboard/admin";

      navigate(redirectPath);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                readOnly
                className="w-full bg-gray-100 text-gray-500 border px-4 py-2 rounded cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 text-gray-500 border px-4 py-2 rounded cursor-not-allowed"
              />
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Bio
              </label>
              <textarea
                name="shortBio"
                value={formData.shortBio}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goals
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
                placeholder="What are your mentorship goals?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="e.g. JavaScript, React, Node.js"
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <input
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
