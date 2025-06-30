import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";

interface Admin {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchAdmin() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const adminId = user?.roleId;

  useEffect(() => {
    if (!adminId) return;

    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/admin/info/${adminId}`);
        setAdmin(response.data);
        toast.success("Admin data fetched successfully");
      } catch (error: any) {
        console.error("Error fetching admin data", error);
        const message =
          error?.response?.data?.message || "Error fetching admin data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {admin ? `Welcome, ${admin.username}` : "Admin Dashboard"}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading admin dashboard...</p>
      ) : !admin ? (
        <p className="text-red-500">No admin details found.</p>
      ) : (
        <div className="bg-white border border-gray-300 rounded shadow p-6 space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {admin.username}
          </p>
          <p className="text-sm text-gray-600">Email: {admin.email}</p>
          <p className="text-sm text-gray-600">User ID: {admin.userId}</p>
          {admin.role && (
            <p className="text-sm font-medium text-blue-600">
              Role: {admin.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
