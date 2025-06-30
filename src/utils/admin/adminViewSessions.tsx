import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { CalendarDays, Clock, User, Users } from "lucide-react";

interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  mentorUsername: string;
  menteeUsername: string;
}

export default function AdminViewSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.roleId) return;

      setLoading(true);
      try {
        const response = await API.get("/admin/sessions");
        setSessions(response.data.sessions || []);
        toast.success("Sessions fetched successfully");
      } catch (error: any) {
        console.error("Error fetching sessions:", error);
        const message =
          error?.response?.data?.message || "Error fetching session data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.roleId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Mentorship Sessions
      </h2>

      {loading ? (
        <div className="text-gray-600">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No sessions found.</p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-300 rounded shadow p-4 space-y-2"
            >
              <p className="flex items-center text-gray-800">
                <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
                <strong className="mr-1">Date:</strong> {session.date}
              </p>
              <p className="flex items-center text-gray-800">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                <strong className="mr-1">Time:</strong> {session.start_time} -{" "}
                {session.end_time}
              </p>
              <p className="flex items-center text-gray-800">
                <User className="w-4 h-4 mr-2 text-purple-600" />
                <strong className="mr-1">Mentor:</strong>{" "}
                {session.mentorUsername}
              </p>
              <p className="flex items-center text-gray-800">
                <Users className="w-4 h-4 mr-2 text-pink-600" />
                <strong className="mr-1">Mentee:</strong>{" "}
                {session.menteeUsername}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
