import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";

interface TotalUsers {
  username: string;
  email: string;
  role: string;
  id: string;
}

export default function AdminAssignMentor() {
  const [users, setUsers] = useState<TotalUsers[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const adminId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get("/admin/users");
        setUsers(response.data);
        toast.success("Users loaded successfully");
      } catch (error: any) {
        console.error("Failed to load users", error);
        toast.error(
          error?.response?.data?.message || "Error loading users or mentors"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (menteeId: string, mentorId: string) => {
    if (!adminId) {
      toast.error("Admin not logged in.");
      return;
    }

    try {
      const response = await API.post("/admin/assign-mentor", {
        mentorId,
        menteeId,
        adminId,
      });
      setAssignments((prev) => ({ ...prev, [menteeId]: mentorId }));
      toast.success(response?.data?.message || "Mentor assigned successfully");
    } catch (error: any) {
      console.error("Assignment failed", error);
      toast.error(
        error?.response?.data?.message || "Assignment failed. Try again."
      );
    }
  };

  const mentors = users.filter((u) => u.role === "mentor");
  const mentees = users.filter((u) => u.role === "mentee");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Assign Mentors to Mentees
      </h2>

      {isLoading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : mentees.length > 0 ? (
        <div className="space-y-4">
          {mentees.map((mentee) => (
            <div
              key={mentee.id}
              className="border border-gray-300 bg-white rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {mentee.username}
                </p>
                <p className="text-sm text-gray-600">{mentee.email}</p>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Role: {mentee.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={assignments[mentee.id] || ""}
                  onChange={(e) => handleAssign(mentee.id, e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded text-sm bg-white focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No mentees available for assignment.</p>
      )}
    </div>
  );
}
