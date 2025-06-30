import FetchMentor from "../utils/mentor/fetchMentor";
import MentorAvailabilityForm from "../utils/mentor/mentorAvailabilityForm";
import ManageRequests from "../utils/mentor/manageRequests";

export default function MentorDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <FetchMentor />
        </div>

        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <MentorAvailabilityForm />
        </div>

        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <ManageRequests />
        </div>

        {/* <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <AdminViewSessions />
        </div>*/}
      </div>

      {/* <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
        <AdminFetchUsers />
      </div> */}
    </div>
  );
}
