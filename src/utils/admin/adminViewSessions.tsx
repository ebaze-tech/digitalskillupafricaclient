import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";

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
        setSessions(response.data.sessions || []); // assuming backend returns { sessions: [...] }
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mentorship Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <p>
                <strong>Date:</strong> {session.date}
              </p>
              <p>
                <strong>Time:</strong> {session.start_time} - {session.end_time}
              </p>
              <p>
                <strong>Mentor:</strong> {session.mentorUsername}
              </p>
              <p>
                <strong>Mentee:</strong> {session.menteeUsername}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
