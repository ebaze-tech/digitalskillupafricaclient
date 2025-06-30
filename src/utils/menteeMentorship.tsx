import { useEffect, useState } from "react";
import API from "../axios/axios";

interface Mentor {
  id: string;
  name: string;
  expertise: string;
  availableDays: string[];
  time: string;
}

const MenteeMentorship: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await API.get("/mentorship/mentors");
        setMentors(response.data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      }
    };
    fetchMentors();
  }, []);

  const requestMentorship = async (mentorId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      await API.post("/mentorship/request", { mentorId });
      setMessage("Mentorship request sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Available Mentors</h2>
      {mentors.map((mentor) => (
        <div
          key={mentor.id}
          className="border p-4 rounded flex flex-col gap-1 shadow-sm"
        >
          <p className="font-semibold">{mentor.name}</p>
          <p className="text-sm text-gray-600">Expertise: {mentor.expertise}</p>
          <p className="text-sm text-gray-600">
            Availability: {mentor.availableDays.join(", ")} @ {mentor.time}
          </p>
          <button
            onClick={() => requestMentorship(mentor.id)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-fit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Request Mentorship"}
          </button>
        </div>
      ))}
      {message && <p className="text-sm mt-4">{message}</p>}
    </div>
  );
};

export default MenteeMentorship;
