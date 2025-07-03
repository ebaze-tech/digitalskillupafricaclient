import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { Loader2, User2, Mail, Link2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Assignment {
  menteeId: string;
  mentorId: string;
  username: string;
  email: string;
}

export default function AdminAssignMentor() {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const adminId = user?.id;

  const mentors = users.filter((u) => u.role === "mentor");
  const mentees = users.filter((u) => u.role === "mentee");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, assignmentsRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/mentorship-match"),
        ]);

        setUsers(usersRes.data);

        const formatted: Record<string, Assignment> = {};
        assignmentsRes.data.forEach((a: any) => {
          formatted[a.menteeId] = {
            menteeId: a.menteeId,
            mentorId: a.mentorId,
            username: a.username,
            email: a.email,
          };
        });
        setAssignments(formatted);

        toast.success("Users and assignments loaded");
      } catch (error: any) {
        console.error("Failed to load users or assignments", error);
        toast.error("Error loading users or mentorship matches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (menteeId: string, mentorId: string) => {
    if (!adminId) return toast.error("Admin not logged in.");

    try {
      const res = await API.post("/admin/assign-mentor", {
        mentorId,
        menteeId,
        adminId,
      });

      const assignedMentor = mentors.find((m) => m.id === mentorId);
      if (assignedMentor) {
        setAssignments((prev) => ({
          ...prev,
          [menteeId]: {
            menteeId,
            mentorId,
            username: assignedMentor.username,
            email: assignedMentor.email,
          },
        }));
      }

      toast.success(res?.data?.message || "Mentor assigned successfully");
    } catch (error: any) {
      console.error("Assignment failed", error);
      toast.error(
        error?.response?.data?.message || "Assignment failed. Try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Assign Mentors to Mentees
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center text-gray-500 py-10 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      ) : mentees.length === 0 ? (
        <p className="text-center text-gray-500">No mentees available.</p>
      ) : (
        <div className="space-y-5">
          {mentees.map((mentee) => {
            const assigned = assignments[mentee.id];
            return (
              <div
                key={mentee.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
                  {/* Mentee Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 break-words">
                      <User2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span className="truncate">{mentee.username}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 break-words">
                      <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="truncate">{mentee.email}</span>
                    </div>

                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block w-fit">
                      Role: {mentee.role}
                    </div>

                    {assigned && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-green-700 break-words">
                        <Link2 className="w-4 h-4 text-green-600 shrink-0" />
                        Assigned to:{" "}
                        <span className="font-medium truncate">
                          {assigned.username}
                        </span>
                        <span className="truncate">({assigned.email})</span>
                      </div>
                    )}
                  </div>

                  {/* Mentor Select */}
                  <div className="w-full sm:w-64">
                    <select
                      value={assigned?.mentorId || ""}
                      onChange={(e) => handleAssign(mentee.id, e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring focus:ring-indigo-400"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
