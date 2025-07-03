import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  username: string;
  email: string;
}

export default function MenteeUpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await API.get("/mentorship/mentee-upcoming-sessions");
        setSessions(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Upcoming Sessions
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming sessions.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white flex flex-col gap-2"
            >
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Date:</span>{" "}
                {new Date(session.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Time:</span>{" "}
                {session.start_time} - {session.end_time}
              </div>

              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Mentor:</span>{" "}
                {session.username} ({session.email})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
