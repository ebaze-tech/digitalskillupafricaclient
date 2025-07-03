import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp, ThumbsDown, Mail, User } from "lucide-react";
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Incoming Mentorship Requests
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-600 text-center">
          You have no mentorship requests at this time.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User className="w-5 h-5 text-indigo-500" />
                  {req.username}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 break-words">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {req.email}
                </div>
              </div>

              <div className="mt-auto">
                {req.status === "pending" ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleRespond(req.id, "accepted")}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm disabled:opacity-60 transition"
                      disabled={respondingId === req.id}
                    >
                      {respondingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp size={16} />
                          Accept
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRespond(req.id, "rejected")}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm disabled:opacity-60 transition"
                      disabled={respondingId === req.id}
                    >
                      {respondingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ThumbsDown size={16} />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-sm font-semibold px-3 py-1 rounded-full w-fit mt-2 ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
