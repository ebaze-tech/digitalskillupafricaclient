import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../axios/axios";
import { useParams } from "react-router-dom";

interface MentorInfo {
  id: string;
  name: string;
  availableDays: string[];
  time: string; // e.g. "14:00"
}

const SessionBookingForm: React.FC = () => {
  const [mentor, setMentor] = useState<MentorInfo | null>(null);
  const [date, setDate] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const { mentorId } = useParams();

  useEffect(() => {
    // Fetch assigned mentor info
    const fetchMentor = async () => {
      try {
        const res = await API.get("/mentorship/book-session/all");
        setMentor(res.data);
      } catch (err) {
        console.error("Failed to fetch mentor info", err);
      }
    };
    fetchMentor();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    try {
      await API.post(`/mentorship/book-session/${mentorId}`, {
        mentorId: mentor?.id,
        date,
      });
      toast.success("Session booked successfully!");
      setDate("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to book session.");
      setStatusMsg("Failed to book session.");
    }
  };

  if (!mentor) return <p>Loading mentor info...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-bold">Book a Session with {mentor.name}</h2>

      <div>
        <label className="block mb-1 font-medium">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <p className="text-sm text-gray-600">
        Available days: {mentor.availableDays.join(", ")} at {mentor.time}
      </p>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Session
      </button>

      {statusMsg && <p className="text-sm mt-2">{statusMsg}</p>}
    </form>
  );
};

export default SessionBookingForm;
