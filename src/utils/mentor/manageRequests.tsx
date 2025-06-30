import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../../authContext";

interface MentorshipRequest {
  id: number;
  menteeName: string;
  menteeEmail: string;
  goals: string;
  status: "pending" | "accepted" | "rejected";
}

export default function ManageRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const { user } = useAuth();
  const roleId = user?.roleId;
  console.log(roleId);
  const mentorId = roleId;
  console.log(mentorId);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (!mentorId) return;
        const response = await API.get(`/mentorship/incoming/${mentorId}`);
        setRequests(response.data || []);
      } catch (err) {
        toast.error("Failed to load mentorship requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRespond = async (
    requestId: number,
    status: "accepted" | "rejected"
  ) => {
    setRespondingId(requestId);
    try {
      await API.post(`/mentorship/requests/respond/${requestId}`, { status });
      toast.success(`Request ${status}`);
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status } : req))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to respond");
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="max-w-4xl border border-black mx-auto py-6 px-4 bg-inherit shadow rounded">
      <h2 className="text-2xl font-bold text-black mb-4">
        Mentorship Requests
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-white">No mentorship requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="border p-4 rounded shadow-sm bg-white flex flex-col gap-2"
            >
              <div>
                <p className="font-semibold text-lg">{req.menteeName}</p>
                <p className="text-sm text-white">{req.menteeEmail}</p>
                <p className="text-sm text-white italic">Goals: {req.goals}</p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleRespond(req.id, "accepted")}
                      className="bg-green-600 text-white cursor-pointer px-4 py-1 rounded flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
                      disabled={respondingId === req.id}
                    >
                      <ThumbsUp size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, "rejected")}
                      className="bg-red-600 text-white px-4 py-1 rounded cursor-pointer flex items-center gap-1 hover:bg-red-700 disabled:opacity-50"
                      disabled={respondingId === req.id}
                    >
                      <ThumbsDown size={16} /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
