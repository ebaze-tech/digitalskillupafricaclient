import AdminAssignMentor from "../utils/admin/adminAssignMentor";
import AdminFetchUsers from "../utils/admin/adminFetchUsers";
import FetchAdmin from "../utils/admin/fetchAdmin";
import AdminViewSessions from "../utils/admin/adminViewSessions";
import AdminAddUser from "../utils/admin/adminAddUser";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <FetchAdmin />
        </div>

        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <AdminAddUser />
        </div>

        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <AdminAssignMentor />
        </div>

        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <AdminViewSessions />
        </div>
      </div>

      <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
        <AdminFetchUsers />
      </div>
    </div>
  );
}
