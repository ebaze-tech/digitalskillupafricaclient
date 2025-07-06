import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Loader2, User2, Mail, ShieldCheck } from "lucide-react";

// Type definition for the user data structure
interface AdminUsers {
  userId: string; // Could be used for linking to other tables
  username: string;
  email: string;
  role?: string; // Optional role
  id: string; // Unique user identifier (used for editing)
}

export default function AdminFetchUsers() {
  // State to hold all fetched users
  const [users, setUsers] = useState<AdminUsers[]>([]);
  // Loading state to control UI feedback
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Make API request to get users
        const response = await API.get("/admin/users");
        setUsers(response.data); // Update state with user data
        toast.success("Users fetched successfully");
      } catch (error: any) {
        console.error("Error loading users", error);
        const message = error?.response?.data?.message || "Error loading users";
        toast.error(message);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        All Registered Users
      </h2>

      {/* Show loading spinner while fetching users */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500 gap-2">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Loading users...</span>
        </div>
      ) : users.length === 0 ? (
        // Show message if no users found
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        // Render user cards
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* User info section */}
              <div className="space-y-2 mb-4">
                {/* Username */}
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User2 className="w-5 h-5 text-indigo-600" />
                  {user.username}
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {user.email}
                </div>

                {/* User ID */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {user.id}
                </div>

                {/* Role display */}
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Role:{" "}
                  <span className="capitalize font-medium ml-1">
                    {user.role || "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Edit button linking to the edit user page */}
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
