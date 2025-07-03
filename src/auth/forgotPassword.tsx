import { useState } from "react";
import API from "../axios/axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
      setEmail("");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex flex-col">
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
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-2 bg-white px-4 py-3 rounded shadow">
            <button
              onClick={() => navigate("/login")}
              className="text-left hover:text-indigo-600 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-left hover:text-indigo-600 cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Forgot Password Form */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
    </div>
  );
}
