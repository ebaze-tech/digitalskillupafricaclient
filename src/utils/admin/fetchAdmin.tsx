import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { Loader2, UserCircle, Mail, Fingerprint, Shield } from "lucide-react";

// Define the shape of admin data
interface Admin {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchAdmin() {
  // State to store fetched admin data
  const [admin, setAdmin] = useState<Admin | null>(null);

  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(false);

  // Extract current user's roleId from the auth context (adminId here)
  const { user } = useAuth();
  const id = user?.roleId;

  // Fetch admin info on component mount or when adminId changes
  useEffect(() => {
    if (!id) return; // Guard clause for missing ID

    const fetchAdmin = async () => {
      setLoading(true); // Start loading

      try {
        // Request admin details from the backend
        const response = await API.get(`/admin/user/${id}`);

        // Store admin data in state
        setAdmin(response.data);

        toast.success("Admin data fetched successfully");
      } catch (error: any) {
        // Handle request error
        console.error("Error fetching admin data", error);

        const message =
          error?.response?.data?.message || "Error fetching admin data";
        toast.error(message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAdmin(); // Trigger fetch
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {admin ? `Welcome, ${admin.username}` : "Admin Dashboard"}
      </h2>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-600 py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      ) : !admin ? (
        // Show fallback message if admin data isn't found
        <p className="text-center text-red-600 font-medium">
          No admin details found.
        </p>
      ) : (
        // Render admin information card
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
            {/* Admin profile avatar and name */}
            <div className="flex items-center gap-4">
              <UserCircle className="w-14 h-14 text-indigo-600" />
              <div>
                <p className="text-xl font-semibold text-gray-900 break-words">
                  {admin.username}
                </p>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Role:{" "}
                  <span className="text-blue-700 font-semibold uppercase ml-1">
                    {admin.role || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin contact and ID info */}
          <div className="text-sm sm:text-base text-gray-700 space-y-2">
            <div className="flex items-center gap-2 break-all">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{admin.email}</span>
            </div>

            <div className="flex items-center gap-2 break-all">
              <Fingerprint className="w-4 h-4 text-gray-500" />
              <span>User ID: {admin.userId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
