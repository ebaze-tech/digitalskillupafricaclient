import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../axios/axios";

interface Props {
  mentorId: string; // ID of the mentor passed as a prop
}

export default function BookSession({ mentorId }: Props) {
  // State for form inputs
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate if end time is after start time
  const isTimeValid = () => {
    return startTime < endTime;
  };

  // Handle session booking form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!date || !startTime || !endTime) {
      return toast.error("All fields are required.");
    }

    if (!isTimeValid()) {
      return toast.error("End time must be after start time.");
    }

    setLoading(true);

    try {
      // Send POST request to backend
      const response = await API.post("/mentorship/sessions", {
        mentorId,
        date,
        start_time: startTime,
        end_time: endTime,
      });

      toast.success(response?.data?.message || "Session booked!");

      // Reset form after success
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "Failed to book session. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-col gap-4 w-full"
    >
      {/* Date Picker */}
      <div className="w-full">
        <label
          htmlFor="session-date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Date
        </label>
        <input
          id="session-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          required
        />
      </div>

      {/* Start and End Time Fields */}
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-gray-700 mb-1 text-center"
          >
            Start Time
          </label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            required
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="end-time"
            className="block text-sm font-medium text-gray-700 mb-1 text-center"
          >
            End Time
          </label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center justify-center text-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-md transition cursor-pointer"
        >
          {loading ? "Booking..." : "Book Session"}
        </button>
      </div>
    </form>
  );
}
