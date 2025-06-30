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
      console.log(payload);

      await API.put(`/profile/setup`, payload);

      if (!user) {
        throw new Error("User is not authenticated");
      }
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

      toast.success("Profile updated successfully");

      if (user?.role === "mentor") {
        navigate("/dashboard/mentor");
      } else if (user?.role === "mentee") {
        navigate("/dashboard/mentee");
      } else {
        navigate("/dashboard/admin");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Readonly fields */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border rounded focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border rounded focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Editable fields */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Short Bio
            </label>
            <textarea
              name="shortBio"
              value={formData.shortBio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Goals</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Experience
            </label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Availability
            </label>
            <input
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded flex justify-center items-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
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
