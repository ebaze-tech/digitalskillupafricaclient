import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios/axios";
import { useAuth } from "../authContext";
import { Loader2 } from "lucide-react";

export default function UpdateProfile() {
  const { user, login } = useAuth(); // Get current user & login function from auth context
  const navigate = useNavigate();

  // Define form structure
  interface FormData {
    username: string;
    email: string;
    shortBio: string;
    goals: string;
    skills: string[];
    industry: string;
    experience: string;
    availability: string;
  }

  // Initial form state
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    shortBio: "",
    goals: "",
    skills: [],
    industry: "",
    experience: "",
    availability: "",
  });

  const [loading, setLoading] = useState(false);

  // Available options
  const skillOptions = [
    "UI/UX",
    "Graphic Design",
    "Web Development",
    "Mobile Development",
    "Backend Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Project Management",
    "Product Management",
    "Marketing",
    "Content Creation",
  ];
  const availabilityOptions = ["Weekly", "Bi-weekly", "Monthly", "As needed"];

  // Determine role and corresponding styles
  const role = user?.role ?? "mentee";
  const textColorMap = {
    admin: "text-yellow-700",
    mentor: "text-green-700",
    mentee: "text-purple-700",
  };
  const focusRingMap = {
    admin: "focus:ring-yellow-400",
    mentor: "focus:ring-green-400",
    mentee: "focus:ring-purple-400",
  };
  const bgGradientMap = {
    admin: "from-yellow-100 via-yellow-200 to-yellow-300",
    mentor: "from-green-100 via-green-200 to-green-300",
    mentee: "from-purple-100 via-purple-200 to-purple-300",
  };
  const buttonColorMap = {
    admin: "bg-yellow-600 hover:bg-yellow-700",
    mentor: "bg-green-600 hover:bg-green-700",
    mentee: "bg-purple-600 hover:bg-purple-700",
  };

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        shortBio: user.shortBio || "",
        goals: user.goals || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        industry: user.industry || "",
        experience: user.experience || "",
        availability: user.availability || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "skills") {
      // Multiple select for skills
      const selected = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((o) => o.value);
      setFormData((prev) => ({ ...prev, skills: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.skills.length === 0) {
        throw new Error("At least one skill must be selected.");
      }

      const payload = {
        username: formData.username,
        shortBio: formData.shortBio,
        goals: formData.goals,
        skills: formData.skills,
        industry: formData.industry,
        experience: formData.experience,
        availability: formData.availability || undefined,
      };

      const res = await API.put(`/users/me/profile`, payload);

      // Update auth context and local storage
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser);

      toast.success("Profile updated successfully");

      // Navigate based on user role
      navigate(
        role === "mentor"
          ? "/dashboard/mentor"
          : role === "mentee"
          ? "/dashboard/mentee"
          : "/admin"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br ${bgGradientMap[role]}`}
    >
      <div className="w-full max-w-4xl bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
        <h2
          className={`text-3xl font-bold text-center ${textColorMap[role]} mb-6`}
        >
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Non-editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                readOnly
                className="w-full bg-gray-100 text-gray-500 border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 text-gray-500 border px-4 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Short Bio
              </label>
              <textarea
                name="shortBio"
                value={formData.shortBio}
                onChange={handleChange}
                rows={3}
                required
                className={`w-full border px-4 py-2 rounded-md focus:outline-none ${focusRingMap[role]}`}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={3}
                required
                className={`w-full border px-4 py-2 rounded-md focus:outline-none ${focusRingMap[role]}`}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Skills (select all that apply)
              </label>
              <select
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleChange}
                required
                className={`w-full border px-4 py-2 rounded-md h-36 focus:outline-none ${focusRingMap[role]}`}
              >
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {formData.skills.length > 0 && (
                <div className="text-sm mt-2 text-gray-600">
                  Selected: {formData.skills.join(", ")}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className={`w-full border px-4 py-2 rounded-md focus:outline-none ${focusRingMap[role]}`}
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
                  className={`w-full border px-4 py-2 rounded-md focus:outline-none ${focusRingMap[role]}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required={user?.role === "mentor"}
                  className={`w-full border px-4 py-2 rounded-md focus:outline-none ${focusRingMap[role]}`}
                >
                  <option value="">Select</option>
                  {availabilityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 ${buttonColorMap[role]} text-white font-semibold py-3 rounded-md transition`}
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
