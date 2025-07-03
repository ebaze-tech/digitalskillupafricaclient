import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../axios/axios";
import { Loader2, Menu, X } from "lucide-react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/reset-password", { token, newPassword });
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || " Reset failed.");
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
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer"
            >
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

      {/* Reset Form */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Enter your new password below.
          </p>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
    </div>
  );
}
