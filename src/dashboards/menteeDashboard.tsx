import FetchMentee from "../utils/mentee/fetchMentee";
import ViewMentors from "../utils/mentee/viewMentors";
// import MenteeMentorship from "../utils/menteeMentorship";
// import SessionBookingForm from "../utils/sessionBookingForm";

export default function MenteeDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <FetchMentee />
        </div>
        <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <ViewMentors />
        </div>

        {/* <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <MentorAvailabilityForm />
        </div> */}

        {/* <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
          <ManageRequests />
        </div> */}

        {/* <div className="bg-inherit p-4 rounded-xl shadow-md border border-black">
           <AdminViewSessions />
         </div>*/}
      </div>
    </div>
  );
}
