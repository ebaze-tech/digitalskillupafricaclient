import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../../authContext";

interface MentorshipRequest {
  id: string;
  menteeId: string;
  username: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
}

export default function ManageRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/incoming/${user.id}`);
        setRequests(response.data || []);
      } catch (err: any) {
        toast.error(
          err.response?.data?.error || "Failed to load mentorship requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const handleRespond = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    setRespondingId(requestId);
    try {
      await API.post(`/mentorship/requests/respond/${requestId}`, { status });
      toast.success(`Request ${status}`);
      // setRequests((prev) =>
      //   prev.map((req) => (req.id === requestId ? response.data : req))
      // );
      const response = await API.get(`/mentorship/incoming/${user?.id}`);
      setRequests(response.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to respond");
    } finally {
      setRespondingId(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6">
        <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
        Loading user info...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-black mb-6 text-center">
        Mentorship Requests
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 text-center">
          No mentorship requests found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border rounded-lg shadow-md bg-white p-6 flex flex-col justify-between h-full"
            >
              <div className="mb-4">
                <p className="text-xl font-semibold text-gray-900">
                  {req.username}
                </p>
                <p className="text-sm text-gray-500">{req.email}</p>
              </div>

              <div className="flex items-center justify-between">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleRespond(req.id, "accepted")}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-60"
                      disabled={respondingId === req?.id}
                    >
                      {respondingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ThumbsUp size={16} />
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, "rejected")}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                      disabled={respondingId === req.id}
                    >
                      {respondingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ThumbsDown size={16} />
                      )}
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
