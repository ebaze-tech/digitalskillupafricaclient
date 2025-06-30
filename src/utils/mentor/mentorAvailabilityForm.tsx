import { useState, useEffect } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface Availability {
  day: string;
  start: string;
  end: string;
}

export default function MentorAvailabilityForm() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMentorAvailability = async () => {
      try {
        const response = await API.get("/mentorship/availability/mentor");
        console.log(response);
        const transformed = response.data.map((slot: any) => ({
          day: slot.day_of_week,
          start: slot.start_time,
          end: slot.end_time,
        }));
        setAvailability(transformed);
        toast.success("Mentor, kindly set availability");
      } catch (error: any) {
        console.error("Failed to load existing availability", error);
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      }
    };
    fetchMentorAvailability();
  }, []);

  const updateDay = (day: string, field: "start" | "end", value: string) => {
    setAvailability((prev) => {
      const exists = prev.find((a) => a.day === day);
      if (exists) {
        return prev.map((a) => (a.day === day ? { ...a, [field]: value } : a));
      } else {
        return [
          ...prev,
          {
            day,
            start: field === "start" ? value : "",
            end: field === "end" ? value : "",
          },
        ];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      // Clear previous entries
      await API.delete("/mentorship/availability");

      // Submit only valid entries
      const validSlots = availability.filter((a) => a.start && a.end);
      for (const slot of validSlots) {
        await API.post("/mentorship/availability", {
          day_of_week: slot.day,
          start_time: slot.start,
          end_time: slot.end,
        });
      }

      setSuccess(true);
      toast.success("Availability saved successfully!");
    } catch (error: any) {
      console.error("Error saving availability:", error);
      setSuccess(false);
      const message =
        error?.response?.data?.message || "Error saving mentor availability";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold text-black mb-4">
        Set Your Weekly Availability
      </h2>

      {daysOfWeek.map((day) => {
        const slot = availability.find((a) => a.day === day) || {
          day,
          start: "",
          end: "",
        };

        return (
          <div key={day} className="flex items-center gap-4">
            <label className="w-24 font-medium">{day}</label>

            <input
              type="time"
              value={slot.start}
              onChange={(e) => updateDay(day, "start", e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
            <span>to</span>
            <input
              type="time"
              value={slot.end}
              onChange={(e) => updateDay(day, "end", e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
          </div>
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Availability"}
      </button>

      {success && (
        <p className="text-green-600 mt-2">Availability saved successfully!</p>
      )}
      {success === false && (
        <p className="text-red-600 mt-2">Failed to save availability.</p>
      )}
    </form>
  );
}
