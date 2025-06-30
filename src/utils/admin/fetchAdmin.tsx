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
  console.log(user?.roleId);
  const roleId = user?.roleId;
  console.log(roleId);

  const adminId = roleId;

  useEffect(() => {
    if (!adminId) return;

    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/admin/info/${adminId}`);
        console.log(response.data + "Admin");
        setAdmin(response.data);
        toast.success("Mentor data fetched successfully");
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Welcome {admin?.username}</h2>

      {loading ? (
        <p>Loading admin dashboard...</p>
      ) : !admin ? (
        <p>No admin details found.</p>
      ) : (
        <div className="space-y-4">
          <div
            key={admin?.userId}
            className="border p-4 rounded shadow-sm flex items-center justify-between bg-blue-400"
          >
            <div>
              <p className="font-semibold text-lg">{admin?.username}</p>
              <p className="text-sm text-white">User ID: {admin?.userId}</p>
              {admin?.role && (
                <p className="text-sm text-blue-600 font-medium">
                  Role: {admin?.role}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
