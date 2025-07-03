import FetchMentor from "../utils/mentor/fetchMentor";
import MentorAvailabilityForm from "../utils/mentor/mentorAvailabilityForm";
import ManageRequests from "../utils/mentor/manageRequests";
import AssignedMentees from "../utils/mentor/assignedMentee";
import MentorUpcomingSessions from "../utils/mentor/upcomingSessions";

export default function MentorDashboard() {
  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-green-700 mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-black">
            View your profile, set your availability, and manage mentorship
            requests.
          </p>
        </div>
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <FetchMentor />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <MentorAvailabilityForm />
          </div>
        </div>{" "}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <AssignedMentees />
        </div>
        {/* Requests Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <ManageRequests />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <MentorUpcomingSessions />
        </div>
      </div>
    </div>
  );
}
