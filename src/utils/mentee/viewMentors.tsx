import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import BookSession from "./bookSession";

// Define the expected structure of a mentor object
interface Mentor {
  mentorId: string;
  username: string;
  shortBio: string;
  industry: string;
  experience: string;
  email: string;
  skills: string[];
  id: string;
}

export default function ViewMentors() {
  // Store fetched mentors
  const [mentors, setMentors] = useState<Mentor[]>([]);
  // State for filtering
  const [skill, setSkill] = useState("");
  const [industry, setIndustry] = useState("");
  // Loading state for fetch
  const [loading, setLoading] = useState(false);
  // Status map for mentorship request per mentor
  const [requestStatuses, setRequestStatuses] = useState<
    Record<string, string>
  >({});

  // Fetch mentors with optional skill/industry filters
  const fetchMentors = async () => {
    try {
      setLoading(true);

      // Build query params dynamically
      const query = new URLSearchParams();
      if (skill) query.append("skill", skill);
      if (industry) query.append("industry", industry);

      const res = await API.get(`/mentorship/mentors?${query.toString()}`);
      setMentors(res.data || []);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Error fetching mentors";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch request statuses for mentors to know if a request has been sent/accepted/rejected
  const fetchRequests = async () => {
    try {
      const res = await API.get("/mentorship/request-to-mentor");
      const statusMap: Record<string, string> = {};
      res.data.forEach((req: any) => {
        statusMap[req.mentorId] = req.status;
      });
      setRequestStatuses(statusMap);
    } catch (error: any) {
      console.error("Failed to fetch mentorship requests");
    }
  };

  // Fetch mentors and request statuses on component mount
  useEffect(() => {
    fetchMentors();
    fetchRequests();
  }, []);

  // Handle sending mentorship request
  const handleRequest = async (mentorId: string) => {
    try {
      await API.post("/mentorship/request", { mentorId });
      toast.success("Mentorship request sent!");
      fetchRequests(); // Update the UI with latest status
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Failed to send request";
      toast.error(msg);
    }
  };

  // Handle filter/search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentors();
  };

  return (
    <div className="max-w-7xl mx-auto w-full overflow-hidden">
      {/* Filter/Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row md:items-center gap-4 mb-10"
      >
        <input
          type="text"
          placeholder="Filter by skill (e.g. JavaScript)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
        />
        <input
          type="text"
          placeholder="Filter by industry (e.g. Fintech)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium text-sm shadow transition cursor-pointer"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Mentor Cards Section */}
      {mentors.length === 0 && !loading ? (
        <p className="text-center text-red-600 font-medium">
          No mentors found.
        </p>
      ) : (
        <div className="grid grid-cols1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:w-200">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex flex-col justify-between h-full bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Mentor Info */}
              <div className="space-y-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mentor.username}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Industry:</strong> {mentor.industry}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Experience:</strong> {mentor.experience}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Skills:</strong>{" "}
                  <span className="text-gray-600 break-words">
                    {mentor.skills.join(", ")}
                  </span>
                </p>
                <p className="text-sm text-gray-600 italic mt-1 break-words">
                  "{mentor.shortBio}"
                </p>
              </div>

              {/* Request Button & Booking Form */}
              <div className="flex flex-col gap-3">
                {requestStatuses[mentor.id] ? (
                  <button
                    disabled
                    className={`px-4 py-2 rounded text-sm font-medium transition cursor-pointer ${
                      requestStatuses[mentor.id] === "accepted"
                        ? "bg-green-500 text-white"
                        : requestStatuses[mentor.id] === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {requestStatuses[mentor.id] === "accepted"
                      ? "Accepted"
                      : requestStatuses[mentor.id] === "rejected"
                      ? "Rejected"
                      : "Request Sent"}
                  </button>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer"
                    onClick={() => handleRequest(mentor.id)}
                  >
                    Request Mentorship
                  </button>
                )}

                {/* Booking Component */}
                <BookSession mentorId={mentor.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
