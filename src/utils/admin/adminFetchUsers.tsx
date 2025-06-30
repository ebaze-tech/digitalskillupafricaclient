import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Registered Users
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Loading admin dashboard...
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-300 bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  {user.username}
                </p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">User ID: {user.id}</p>
                {user.role && (
                  <p className="text-sm text-blue-600 font-medium">
                    Role: {user.role}
                  </p>
                )}
              </div>

              <Link to={`/admin/edit/${user.id}`} className="mt-4 md:mt-0">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200">
                  Edit
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
