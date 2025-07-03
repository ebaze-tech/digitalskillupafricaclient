import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { useAuth } from "../../authContext";
import { Loader2 } from "lucide-react"; // Import the loader icon

export default function AdminStats() {
  const [totalSessions, setTotalSessions] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await API.get("/admin/total-sessions");
        setTotalSessions(res.data.totalSessions);
      } catch (err) {
        console.error("Error loading session stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return (
    <div className="p-4 border bg-white rounded-lg shadow w-full max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        Total Sessions Held
      </h3>
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
