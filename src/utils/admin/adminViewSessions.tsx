import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { CalendarDays, Clock, User, Users, Loader2 } from "lucide-react";

// Define the shape of a mentorship session object
interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  mentorUsername: string;
  menteeUsername: string;
}

export default function AdminViewSessions() {
  // State to hold the list of sessions
  const [sessions, setSessions] = useState<Session[]>([]);

  // State to manage loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  // Get the currently authenticated user from context
  const { user } = useAuth();

  // Fetch sessions when component mounts or when user's role ID changes
  useEffect(() => {
    const fetchSessions = async () => {
      // Prevent API call if roleId is missing (defensive check)
      if (!user?.roleId) return;

      setLoading(true); // Show loading spinner

      try {
        // Call backend API to get session data
        const response = await API.get("/admin/sessions");

        // Fallback to empty array if no data found
        setSessions(response.data.sessions || []);

        toast.success("Sessions fetched successfully");
      } catch (error: any) {
        console.error("Error fetching sessions:", error);
        const message =
          error?.response?.data?.message || "Error fetching session data";
        toast.error(message);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchSessions();
  }, [user?.roleId]); // Re-run effect if roleId changes

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Mentorship Sessions
      </h2>

      {/* Show loading indicator while fetching sessions */}
      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-600 py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        // Show fallback if no sessions are available
        <p className="text-red-500 text-center">No sessions found.</p>
      ) : (
        // Display each session in a responsive grid
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition"
            >
              {/* Session Date */}
              <div className="flex items-center gap-2 text-gray-800 mb-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">
                  {new Date(session.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Time Range */}
              <div className="flex items-center gap-2 text-gray-800 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  {session.start_time} – {session.end_time}
                </span>
              </div>

              {/* Mentor Name */}
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <User className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">
                  Mentor: {session.mentorUsername}
                </span>
              </div>

              {/* Mentee Name */}
              <div className="flex items-center gap-2 text-pink-700">
                <Users className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium">
                  Mentee: {session.menteeUsername}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
