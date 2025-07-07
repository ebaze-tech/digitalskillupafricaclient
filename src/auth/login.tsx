import { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import API from "../axios/axios";
import { Loader2, Menu, X } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      console.log(response.data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      const needsProfileUpdate =
        (user.role === "mentor" || user.role === "mentee") &&
        (!user.username ||
          !user.shortBio ||
          !user.goals ||
          !user.skills ||
          // user.skills ||
          (user.role === "mentor" &&
            (!user.industry || !user.experience || !user.availability)));

      if (needsProfileUpdate) {
        toast.info("Please complete your profile to continue.");
        return navigate("/profile/edit");
      }

      switch (user.role) {
        case "admin":
          navigate("/admin");
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

  const NavLink = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="text-gray-700 hover:text-indigo-600 px-4 py-2 font-medium cursor-pointer"
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-extrabold text-indigo-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Mentor<span className="text-green-600">Link</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink label="Home" onClick={() => navigate("/")} />
            <NavLink label="Register" onClick={() => navigate("/register")} />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 cursor-pointer" />
              ) : (
                <Menu className="w-6 h-6 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-2 bg-white px-4 py-3 rounded shadow">
            <NavLink
              label="Home"
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
            />
            <NavLink
              label="Register"
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </nav>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
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
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
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

          <div className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </div>
          <div
            className="mt-4 text-sm text-center text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot your password?
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 text-center border-t border-gray-200 text-sm text-gray-600">
        © {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
    </div>
  );
}
