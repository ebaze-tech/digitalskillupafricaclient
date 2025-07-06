import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import { Loader2 } from "lucide-react";

// Type definition for the mentee object
interface Mentee {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchMentee() {
  const [mentee, setMentee] = useState<Mentee | null>(null); // Stores fetched mentee details
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator
  const { user } = useAuth(); // Get current authenticated user from context

  const id= user?.roleId; // Extract mentee's role ID (assumed to be the mentee ID)

  useEffect(() => {
    // If menteeId is not available, skip fetch
    if (!id)return;

    // Fetch mentee profile from backend
    const fetchMentee = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentee/users/${id}`);
        setMentee(response.data); // Set fetched data to state
        toast.success("Mentee profile loaded");
      } catch (error: any) {
        console.error("Error fetching mentee data", error);
        const message =
          error?.response?.data?.message || "Error fetching mentee data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentee(); // Call the fetch function
  }, [id])

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
        {mentee ? `Welcome, ${mentee.username}` : "Mentee Dashboard"}
      </h2>

      {/* Show loading indicator */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-500 py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your details...</span>
        </div>
      ) : !mentee ? (
        // Show fallback message if mentee data is not available
        <p className="text-red-500 text-center">Mentee details not found.</p>
      ) : (
        // Display mentee info card
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 space-y-4">
          <div className="text-center sm:text-left">
            <p className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
              {mentee.username}
            </p>
            <p className="text-sm text-gray-600 break-words">
              User ID: {mentee.userId}
            </p>
            <p className="text-sm text-gray-600">{mentee.email}</p>
          </div>

          {/* Display role tag if available */}
          {mentee.role && (
            <div className="pt-2 text-center sm:text-left">
              <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                Role: {mentee.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
