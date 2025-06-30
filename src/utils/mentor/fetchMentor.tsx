import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { Loader2 } from "lucide-react";

interface Mentor {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchMentor() {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const mentorId = user?.roleId;

  useEffect(() => {
    if (!mentorId) return;

    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentor/info/${mentorId}`);
        setMentor(response.data);
        toast.success("Mentor data loaded successfully");
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-black mb-6 text-center">
        {mentor ? `Welcome, ${mentor.username}` : "Mentor Dashboard"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
          <span className="ml-2 text-gray-500">
            Loading mentor dashboard...
          </span>
        </div>
      ) : !mentor ? (
        <p className="text-red-600 text-center">Mentor details not found.</p>
      ) : (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mentor.username}
            </h3>
            <p className="text-sm text-gray-600">Email: {mentor.email}</p>
            <p className="text-sm text-gray-600">User ID: {mentor.userId}</p>
          </div>

          {mentor.role && (
            <div className="mt-2">
              <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                Role: {mentor.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
