import AdminAssignMentor from "../utils/admin/adminAssignMentor";
import AdminFetchUsers from "../utils/admin/adminFetchUsers";
import FetchAdmin from "../utils/admin/fetchAdmin";
import AdminViewSessions from "../utils/admin/adminViewSessions";
import AdminAddUser from "../utils/admin/adminAddUser";
import AdminStats from "../utils/admin/adminStats";
import AdminMentorshipMatches from "../utils/admin/viewAllMentorshipMatch";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-6 md:p-10 space-y-10 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-black text-center mb-8">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <FetchAdmin />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <AdminStats />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 lg:col-span-2">
          <AdminViewSessions />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <AdminAssignMentor />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <AdminAddUser />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <AdminFetchUsers />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <AdminMentorshipMatches />
      </div>
    </div>
  );
}
