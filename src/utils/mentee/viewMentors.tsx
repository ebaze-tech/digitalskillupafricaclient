import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

interface Mentor {
  mentorId: string;
  username: string;
  shortBio: string;
  industry: string;
  experience: string;
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
      console.log(res.data[0] + "Mentor data");
      res.data.forEach((mentor: Mentor, i: number) =>
        console.log(`Mentor #${i + 1}: ${mentor.shortBio}`)
      );

      setMentors(res.data || []);
    } catch (error: any) {
      console.error("Error fetching mentors", error);
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
      await API.post("/mentorship/request", {
        mentorId,
      });
      toast.success("Mentorship request sent!");
    } catch (error: any) {
      console.error("Request failed", error);
      const msg = error?.response?.data?.error || "Failed to send request";
      toast.error(msg);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentors();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        Browse Available Mentors
      </h2>

      {/* Filter Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Filter by skill (e.g. JavaScript)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Filter by industry (e.g. Fintech)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Mentor Cards */}
      {mentors.length === 0 && !loading ? (
        <p className="text-red-700 text-center">No mentors found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-inherit p-4 rounded-lg shadow-md border border-black"
            >
              <h3 className="text-lg font-semibold text-black">
                {mentor.username}
              </h3>
              <p className="text-sm text-white mb-2">
                <strong>Industry:</strong> {mentor.industry}
              </p>
              <p className="text-sm text-white mb-3">
                <strong>Bio:</strong> {mentor.shortBio}
              </p>

              <p className="text-sm mb-3 text-white">
                <strong>Experience:</strong> {mentor.experience}
              </p>
              <p className="text-sm mb-3 text-white">
                <strong>Id:</strong> {mentor.id}
              </p>

              <p className="text-sm mb-3 text-white">
                <strong>Skills:</strong>
                {Array.isArray(mentor.skills)
                  ? mentor.skills.join(", ")
                  : mentor.skills}
              </p>

              <button
                className="bg-green-600 hover:bg-green-700 text-black px-4 py-1 rounded text-sm cursor-pointer"
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
