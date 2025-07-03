import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Loader2, User2, Mail, ShieldCheck } from "lucide-react";

interface AdminUsers {
  userId: string;
  username: string;
  email: string;
  role?: string;
  id: string;
}

export default function AdminFetchUsers() {
  const [users, setUsers] = useState<AdminUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/admin/users");
        setUsers(response.data);
        toast.success("Users fetched successfully");
      } catch (error: any) {
        console.error("Error loading users", error);
        const message = error?.response?.data?.message || "Error loading users";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        All Registered Users
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500 gap-2">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Loading users...</span>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User2 className="w-5 h-5 text-indigo-600" />
                  {user.username}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Role:{" "}
                  <span className="capitalize font-medium ml-1">
                    {user.role || "Unassigned"}
                  </span>
                </div>
              </div>

              <Link to={`/dashboard/admin/edit/${user.id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer">
                  Edit User
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
