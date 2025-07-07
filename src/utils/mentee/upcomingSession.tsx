import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { CalendarDays, Clock, Loader2, Mail, User2 } from "lucide-react";

// Type definition for a session object
interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  username: string; // Mentor's username
  email: string; // Mentor's email
}

export default function MenteeUpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]); // Store upcoming sessions
  const [loading, setLoading] = useState(false); // Indicates if data is being fetched

  useEffect(() => {
    // Fetch upcoming sessions for the mentee
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await API.get("/mentorship/sessions/mentee");
        setSessions(res.data); // Set fetched session data
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load sessions");
      } finally {
        setLoading(false); // Turn off loading spinner
      }
    };

    fetchSessions(); // Invoke fetch on component mount
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        Upcoming Sessions
      </h2>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-600 py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        // Empty state
        <p className="text-center text-gray-500 text-sm">
          No upcoming sessions.
        </p>
      ) : (
        // Render each session card
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white flex flex-col gap-2"
            >
              {/* Session Date */}
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CalendarDays className="w-5 h-5 text-blue-600" />{" "}
                <span>Date:</span>{" "}
                {new Date(session.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Session Time */}
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Clock className="w-5 h-5 text-green-600" />
                <span>
                  <strong>Time:</strong> {session.start_time} –{" "}
                  {session.end_time}
                </span>
              </div>

              {/* Mentee name */}
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <User2 className="w-5 h-5 text-indigo-600" />
                <span>
                  <strong>Mentee:</strong> {session.username}
                </span>
              </div>

              {/* Mentee email */}
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
