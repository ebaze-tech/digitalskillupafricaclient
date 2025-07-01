import { useState } from "react";
import API from "../axios/axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
      setEmail("");
    } catch (error: any) {
      const msg = error.response?.data?.message;
      console.log(error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
