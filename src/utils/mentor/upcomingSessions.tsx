import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { CalendarDays, Clock, User2, Mail, Loader2 } from "lucide-react";

interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  username: string;
  email: string;
}

export default function MentorUpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await API.get("/mentorship/mentor-upcoming-sessions");
        toast.success("Upcoming sessions data fetched successfully");
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Upcoming Sessions
      </h2>

      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-600 py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No upcoming sessions.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(session.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Clock className="w-5 h-5 text-green-600" />
                <span>
                  <strong>Time:</strong> {session.start_time} –{" "}
                  {session.end_time}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-800">
                <User2 className="w-5 h-5 text-indigo-600" />
                <span>
                  <strong>Mentee:</strong> {session.username}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-800 break-all">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{session.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
