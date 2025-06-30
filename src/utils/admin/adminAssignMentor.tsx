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

        console.log("Fetched userss:", response.data);

        setUsers(response.data);
      } catch (error: any) {
        console.error("Failed to load users or mentors", error);
        const message =
          error?.response?.data?.message || "Error loading users or mentors";
        toast.error(message);
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
    console.log("Assigning:", { menteeId, mentorId, adminId });

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
      const message =
        error?.response?.data?.message || "Assignment failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <div className="p-4 space-y-6 ">
      <h2 className="text-xl font-bold mb-4">Assign Mentors to Mentees</h2>

      {isLoading ? (
        <p>Loading users....</p>
      ) : users.length > 0 ? (
        users
          .filter((user) => user.role === "mentee")
          .map((mentee) => (
            <div
              key={mentee.id}
              className="border p-4 rounded shadow-sm flex items-center justify-between bg-blue-400"
            >
              <div>
                <p className="font-semibold">{mentee.username}</p>
                <p className="text-sm text-white">{mentee.email}</p>
                <p className="text-sm text-white">{mentee.role}</p>
                <p className="text-xs text-white">ID: {mentee.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={assignments[mentee.id] || ""}
                  onChange={(e) => handleAssign(mentee.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="" className="bg-inherit">Select Mentor</option>
                  {users
                    .filter((mentor) => mentor.role === "mentor")
                    .map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.username}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))
      ) : (
        <p>No mentees available for assignment.</p>
      )}
    </div>
  );
}
