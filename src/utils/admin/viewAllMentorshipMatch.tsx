import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { Users, Mail, Loader2, Link2 } from "lucide-react";

interface Match {
  menteeId: string;
  mentorId: string;
  mentee_username: string;
  mentee_email: string;
  mentor_username: string;
  mentor_email: string;
}

export default function AdminMentorshipMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/mentorship-match");
        setMatches(res.data || []);
        toast.success("Mentorship matches loaded");
      } catch (error: any) {
        console.error("Failed to fetch matches", error);
        toast.error("Error fetching mentorship matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Mentorship Assignments
      </h2>

      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-600 py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading matches...</span>
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No mentorship matches found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {matches.map((match) => (
            <div
              key={`${match.menteeId}-${match.mentorId}`}
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Mentee
                </h3>
                <p className="text-sm text-gray-700 pl-7">
                  <strong>Name:</strong> {match.mentee_username}
                </p>
                <p className="text-sm text-gray-600 pl-7">
                  <Mail className="inline w-4 h-4 mr-1 text-gray-500" />
                  {match.mentee_email}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Mentor
                </h3>
                <p className="text-sm text-gray-700 pl-7">
                  <strong>Name:</strong> {match.mentor_username}
                </p>
                <p className="text-sm text-gray-600 pl-7">
                  <Mail className="inline w-4 h-4 mr-1 text-gray-500" />
                  {match.mentor_email}
                </p>
              </div>

              <div className="mt-3 flex items-center text-sm text-blue-600 pl-1">
                <Link2 className="w-4 h-4 mr-1 text-blue-500" />
                <span>Mentorship Linked</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
