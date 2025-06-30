import FetchMentee from "../utils/mentee/fetchMentee";
import ViewMentors from "../utils/mentee/viewMentors";

export default function MenteeDashboard() {
  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Mentee Dashboard
          </h1>
          <p className="text-gray-600">
            View your profile and explore available mentors to grow your skills.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mentee Info */}
          <div className="dashboard-card">
            <FetchMentee />
          </div>

          {/* Browse Mentors */}
          <div className="dashboard-card">
            <ViewMentors />
          </div>
        </div>
      </div>
    </div>
  );
}
