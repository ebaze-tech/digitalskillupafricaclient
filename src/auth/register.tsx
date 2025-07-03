import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios/axios";
import { Loader2, Menu, X } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await API.post("/auth/register", {
        email,
        password,
        username,
        role,
      });

      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-extrabold text-indigo-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Mentor<span className="text-green-600">Link</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink label="Home" onClick={() => navigate("/")} />
            <NavLink label="Login" onClick={() => navigate("/login")} />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
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
              label="Login"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </nav>

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="">Select a role</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 text-center border-t border-gray-200 text-sm text-gray-600">
        © {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
    </div>
  );
}
