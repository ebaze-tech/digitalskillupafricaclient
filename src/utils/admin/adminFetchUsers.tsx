import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
        console.log("Fetched users:", response.data);
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
    <div className="p-4 ">
      <h2 className="text-xl font-bold mb-4 text-black">All Registered Users</h2>

      {loading ? (
        <p>Loading admin dashboard...</p>
      ) : (
        <div className="space-y-4">
          {users &&
            users.map((user) => (
              <div
                key={user.id}
                className="border p-4 rounded shadow-sm flex items-center justify-between bg-blue-400"
              >
                <div>
                  <p className="font-semibold text-lg">{user.username}</p>
                  <p className="text-sm text-white">Email: {user.email}</p>
                  <p className="text-sm text-white">User ID: {user.id}</p>
                  {user.role && (
                    <p className="text-sm text-blue-800 font-medium">
                      Role: {user.role}
                    </p>
                  )}
                </div>
                <Link to={`/admin/edit/${user.id}`}>
                  <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
