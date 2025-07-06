import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { useAuth } from "../../authContext";
import { Loader2 } from "lucide-react"; // Spinner icon for loading state

export default function AdminStats() {
  // State to hold the total number of mentorship sessions
  const [totalSessions, setTotalSessions] = useState<number | null>(null);

  // State to track if data is currently being fetched
  const [loading, setLoading] = useState<boolean>(false);

  // Get the authenticated user from context
  const { user } = useAuth();

  // Fetch total sessions when component mounts or user ID changes
  useEffect(() => {
    const fetchStats = async () => {
      // Exit early if user ID is not available
      if (!user?.id) return;

      setLoading(true); // Start loading

      try {
        // API call to fetch total session stats
        const res = await API.get("/admin/total-sessions");
        setTotalSessions(res.data.totalSessions); // Update state with data
      } catch (err) {
        // Log error in case of failure
        console.error("Error loading session stats", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchStats(); // Call the fetch function
  }, [user?.id]); // Dependency array ensures effect runs on mount or ID change

  return (
    <div className="p-4 border bg-white rounded-lg shadow w-full max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        Total Sessions Held
      </h3>

      {/* Conditionally render loading spinner or session count */}
      <p className="text-md text-center text-black font-bold flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 text-black" />
            <span>Loading...</span>
          </>
        ) : (
          totalSessions
        )}
      </p>
    </div>
  );
}
