import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { Loader2, User2, Mail, Fingerprint, ShieldCheck } from "lucide-react";

// Define the shape of mentor data expected from the backend
interface Mentor {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchMentor() {
  // State for mentor data and loading indicator
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Retrieve authenticated user from context
  const { user } = useAuth();
  const id = user?.roleId;

  // Fetch mentor info on mount or when mentorId changes
  useEffect(() => {
    if (!id) return;

    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentor/users/${id}`);
        setMentor(response.data); // Populate mentor state
        toast.success("Mentor data loaded successfully");
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchMentor();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Dynamic heading based on fetch result */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
        {mentor ? `Welcome, ${mentor.username}` : "Mentor Dashboard"}
      </h2>

      {/* Loader while fetching */}
      {loading ? (
        <div className="flex justify-center items-center gap-2 py-10 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading mentor dashboard...</span>
        </div>
      ) : !mentor ? (
        // Empty state if no mentor data returned
        <p className="text-red-600 text-center font-medium">
          Mentor details not found.
        </p>
      ) : (
        // Mentor card content
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left section: mentor info */}
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800 break-words">
                <User2 className="w-5 h-5 text-indigo-600" />
                <span className="truncate">{mentor.username}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600 break-words">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="truncate">{mentor.email}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600 break-words">
                <Fingerprint className="w-4 h-4 text-gray-500" />
                <span className="truncate">ID: {mentor.userId}</span>
              </p>
            </div>

            {/* Right section: role badge if available */}
            {mentor.role && (
              <div className="flex md:justify-end justify-center items-center">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  {mentor.role.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
