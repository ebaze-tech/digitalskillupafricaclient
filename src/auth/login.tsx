import { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import API from "../axios/axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      console.log(user);

      const needsProfileUpdate =
        (user.role === "mentor" || user.role === "mentee") &&
        (!user.username ||
          !user.shortBio ||
          !user.goals ||
          !user.skills ||
          user.skills.length === 0 ||
          (user.role === "mentor" &&
            (!user.industry || !user.experience || !user.availability)));

      if (needsProfileUpdate) {
        toast.info("Please complete your profile to continue.");
        return navigate("/update-profile");
      }

      switch (user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "mentor":
          navigate("/dashboard/mentor");
          break;
        case "mentee":
          navigate("/dashboard/mentee");
          break;
        default:
          navigate("/login");
          break;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
