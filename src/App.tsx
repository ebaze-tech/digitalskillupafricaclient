import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import HomePage from "./homepage/home";
import RegisterPage from "./auth/register";
import LoginPage from "./auth/login";
import DashboardLayout from "./utils/dashboardLayout";
import AdminDashboard from "./dashboards/adminDashboard";
import { ToastContainer } from "react-toastify";
import AdminEditUser from "./utils/admin/adminEditUser";
import AdminFetchUsers from "./utils/admin/adminFetchUsers";
import AdminAssignMentor from "./utils/admin/adminAssignMentor";
import AdminViewSessions from "./utils/admin/adminViewSessions";
import AdminMentorshipMatches from "./utils/admin/viewAllMentorshipMatch";

import MentorDashboard from "./dashboards/mentorDashboard";
import MentorAvailabilityForm from "./utils/mentor/mentorAvailabilityForm";
import ManageRequests from "./utils/mentor/manageRequests";
import MentorUpcomingSessions from "./utils/mentor/upcomingSessions";
import AssignedMentees from "./utils/mentor/assignedMentee";

import MenteeDashboard from "./dashboards/menteeDashboard";
import ViewMentors from "./utils/mentee/viewMentors";
import MenteeUpcomingSessions from "./utils/mentee/upcomingSession";

import UpdateProfile from "./utils/updateProfile";
import ForgotPasswordPage from "./auth/forgotPassword";
import ResetPasswordPage from "./auth/resetPassword";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/profile/edit"
        element={
          <DashboardLayout>
            <UpdateProfile />
          </DashboardLayout>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminFetchUsers />} />
        <Route path="sessions" element={<AdminViewSessions />} />
        <Route path="matches" element={<AdminMentorshipMatches />} />
        <Route path="matches/assign" element={<AdminAssignMentor />} />
        <Route path="user/edit/:id" element={<AdminEditUser />} />
      </Route>

      {/* Mentor Routes */}
      <Route path="/dashboard/mentor" element={<DashboardLayout />}>
        <Route index element={<MentorDashboard />} />
        <Route path="availability" element={<MentorAvailabilityForm />} />
        <Route path="requests" element={<ManageRequests />} />
        <Route path="sessions" element={<MentorUpcomingSessions />} />
        <Route path="assigned-mentees" element={<AssignedMentees />} />
      </Route>

      {/* Mentee Routes */}
      <Route path="/dashboard/mentee" element={<DashboardLayout />}>
        <Route index element={<MenteeDashboard />} />
        <Route path="mentors" element={<ViewMentors />} />
        <Route path="my-sessions" element={<MenteeUpcomingSessions />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
