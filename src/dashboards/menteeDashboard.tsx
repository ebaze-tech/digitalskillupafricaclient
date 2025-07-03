import FetchMentee from "../utils/mentee/fetchMentee";
import MenteeUpcomingSessions from "../utils/mentee/upcomingSession";
import ViewMentors from "../utils/mentee/viewMentors";

export default function MenteeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-700 mb-2">
            Mentee Dashboard
          </h1>
          <p className="text-black text-base">
            View your profile and explore mentors to help you grow your career.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <FetchMentee />
          </div>

          {/* Mentors List */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <ViewMentors />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <MenteeUpcomingSessions />
          </div>
        </div>
      </div>
    </div>
  );
}
