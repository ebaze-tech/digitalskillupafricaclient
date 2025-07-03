import { useState, useEffect } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Availability {
  day: string;
  start: string;
  end: string;
}

export default function MentorAvailabilityForm() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMentorAvailability = async () => {
      try {
        const response = await API.get("/mentorship/availability/mentor");
        const transformed = response.data
          .map((slot: any) => ({
            day: slot.day_of_week,
            start: slot.start_time,
            end: slot.end_time,
          }))
          .sort((a, b) => allDays.indexOf(a.day) - allDays.indexOf(b.day));
        setAvailability(transformed);
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      }
    };
    fetchMentorAvailability();
  }, []);

  const handleAddDay = () => {
    if (selectedDay && !availability.some((a) => a.day === selectedDay)) {
      setAvailability([
        ...availability,
        { day: selectedDay, start: "", end: "" },
      ]);
      setSelectedDay("");
    }
  };

  const handleRemoveDay = (day: string) => {
    setAvailability((prev) => prev.filter((a) => a.day !== day));
  };

  const updateDayTime = (
    day: string,
    field: "start" | "end",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, [field]: value } : a))
    );
  };

  const isTimeRangeValid = (start: string, end: string) => start < end;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    const invalidSlot = availability.find(
      (a) => a.start && a.end && !isTimeRangeValid(a.start, a.end)
    );

    if (invalidSlot) {
      toast.error(
        `Invalid time range on ${invalidSlot.day}: Start must be earlier than end.`
      );
      setLoading(false);
      return;
    }

    try {
      await API.delete("/mentorship/availability");

      const validSlots = availability.filter((a) => a.start && a.end);
      for (const slot of validSlots) {
        await API.post("/mentorship/availability", {
          day_of_week: slot.day,
          start_time: slot.start,
          end_time: slot.end,
        });
      }

      toast.success("Availability saved successfully!");
      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Error saving mentor availability";
      toast.error(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const remainingDays = allDays.filter(
    (d) => !availability.some((a) => a.day === d)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Set Your Weekly Availability
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {availability.map((slot) => (
          <div
            key={slot.day}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center"
          >
            <label className="font-medium text-gray-700">{slot.day}</label>

            <input
              type="time"
              value={slot.start}
              onChange={(e) => updateDayTime(slot.day, "start", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
              required
            />

            <input
              type="time"
              value={slot.end}
              onChange={(e) => updateDayTime(slot.day, "end", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
              required
            />

            <button
              type="button"
              onClick={() => handleRemoveDay(slot.day)}
              className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded hover:bg-red-200 transition whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full"
          >
            <option value="">Select a day</option>
            {remainingDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddDay}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition text-sm w-full md:w-auto"
          >
            Add Day
          </button>
        </div>

        <div className="pt-4 text-center md:text-left">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? "Saving..." : "Save Availability"}
          </button>

          {success === false && (
            <p className="text-red-600 mt-2 text-sm">
              Failed to save availability.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
