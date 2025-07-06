import { useState, useEffect } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";

// List of all days in order
const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Type for representing a single day's availability
interface Availability {
  day: string;
  start: string;
  end: string;
}

export default function MentorAvailabilityForm() {
  const [availability, setAvailability] = useState<Availability[]>([]); // State to hold all selected availability slots
  const [selectedDay, setSelectedDay] = useState(""); // Selected day to be added
  const [loading, setLoading] = useState(false); // Submit button loading state
  const [success, setSuccess] = useState<boolean | null>(null); // Indicates save result (success/fail)

  // Fetch mentor's current availability on mount
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
          // Sort the data based on day order (Mon–Sun)
          .sort(
            (a: { day: string }, b: { day: string }) =>
              allDays.indexOf(a.day) - allDays.indexOf(b.day)
          );
        setAvailability(transformed);
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      }
    };

    fetchMentorAvailability();
  }, []);

  // Add a new day slot if not already added
  const handleAddDay = () => {
    if (selectedDay && !availability.some((a) => a.day === selectedDay)) {
      setAvailability([
        ...availability,
        { day: selectedDay, start: "", end: "" },
      ]);
      setSelectedDay("");
    }
  };

  // Remove a day from the availability list
  const handleRemoveDay = (day: string) => {
    setAvailability((prev) => prev.filter((a) => a.day !== day));
  };

  // Update start or end time for a specific day
  const updateDayTime = (
    day: string,
    field: "start" | "end",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, [field]: value } : a))
    );
  };

  // Validate that the start time is before end time
  const isTimeRangeValid = (start: string, end: string) => start < end;

  // Submit the availability form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    // Check if any slot has invalid time range
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
      // Clear previous availability first
      await API.delete("/mentorship/availability");

      // Save each valid availability slot
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

      // Reload the page to reflect updates
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

  // Days not yet selected
  const remainingDays = allDays.filter(
    (d) => !availability.some((a) => a.day === d)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Set Your Weekly Availability
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Render availability slots */}
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

        {/* Add new day slot */}
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

        {/* Submit button */}
        <div className="pt-4 text-center md:text-left">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? "Saving..." : "Save Availability"}
          </button>

          {/* Error message if save fails */}
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
