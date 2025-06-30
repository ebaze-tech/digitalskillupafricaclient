import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

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
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [skill, setSkill] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleRequest = async (mentorId: string) => {
    try {
      await API.post("/mentorship/request", { mentorId });
      toast.success("Mentorship request sent!");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Failed to send request";
      toast.error(msg);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentors();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        Browse Available Mentors
      </h2>

      {/* Filter Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-stretch mb-8"
      >
        <input
          type="text"
          placeholder="Filter by skill (e.g. JavaScript)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm flex-1"
        />
        <input
          type="text"
          placeholder="Filter by industry (e.g. Fintech)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm w-full md:w-auto"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Mentor Cards */}
      {mentors.length === 0 && !loading ? (
        <p className="text-center text-red-600 font-medium">
          No mentors found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="p-5 rounded-md shadow border border-gray-300 bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-black">
                  {mentor.username}
                </h3>

                <div className="text-sm text-gray-800 mb-1">
                  <strong>Industry:</strong> {mentor.industry}
                </div>

                <div className="text-sm text-gray-800 mb-1">
                  <strong>Experience:</strong> {mentor.experience}
                </div>

                <div className="text-sm text-gray-800 mb-1">
                  <strong>Skills:</strong>{" "}
                  <span className="text-gray-600">
                    {mentor.skills.join(", ")}
                  </span>
                </div>

                <div className="text-sm text-gray-800 mt-2 italic">
                  "{mentor.shortBio}"
                </div>
              </div>

              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                onClick={() => handleRequest(mentor.id)}
              >
                Request Mentorship
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
