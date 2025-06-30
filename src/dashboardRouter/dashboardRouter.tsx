import { type JSX } from "react";
import { useAuth } from "../authContext";
import AdminDashboard from "../dashboards/adminDashboard";
import MentorDashboard from "../dashboards/mentorDashboard";
import MenteeDashboard from "../dashboards/menteeDashboard";

export default function DashboardRouter(): JSX.Element {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "mentor":
      return <MentorDashboard />;
    case "mentee":
      return <MenteeDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
}
