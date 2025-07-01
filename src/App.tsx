import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import HomePage from "./homepage/home";
import RegisterPage from "./auth/register";
import LoginPage from "./auth/login";
import "./App.css";
import DashboardLayout from "./utils/dashboardLayout";
import AdminDashboard from "./dashboards/adminDashboard";
import { ToastContainer } from "react-toastify";
import AdminEditUser from "./utils/admin/adminEditUser";
import AdminFetchUsers from "./utils/admin/adminFetchUsers";
import AdminAssignMentor from "./utils/admin/adminAssignMentor";
import AdminViewSessions from "./utils/admin/adminViewSessions";
import MentorDashboard from "./dashboards/mentorDashboard";
import MenteeDashboard from "./dashboards/menteeDashboard";
import UpdateProfile from "./utils/updateProfile";
import "react-toastify/dist/ReactToastify.css";
import MentorAvailabilityForm from "./utils/mentor/mentorAvailabilityForm";
import ManageRequests from "./utils/mentor/manageRequests";
import ViewMentors from "./utils/mentee/viewMentors";
import ForgotPasswordPage from "./auth/forgotPassword";
import ResetPasswordPage from "./auth/resetPassword";
// import SessionBookingForm from "./utils/sessionBookingForm";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* <Route path="/dashboard" element={<div>Loading...</div>} /> */}

      <Route
        path="/dashboard/admin"
        element={
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/admin/users"
        element={
          <DashboardLayout>
            <AdminFetchUsers />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/admin/assign-mentor"
        element={
          <DashboardLayout>
            <AdminAssignMentor />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/admin/sessions"
        element={
          <DashboardLayout>
            <AdminViewSessions />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/admin/edit/:id"
        element={
          <DashboardLayout>
            <AdminEditUser />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/mentor"
        element={
          <DashboardLayout>
            <MentorDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/mentee"
        element={
          <DashboardLayout>
            <MenteeDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/mentee/view-mentors"
        element={
          <DashboardLayout>
            <ViewMentors />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/mentor/availability"
        element={
          <DashboardLayout>
            <MentorAvailabilityForm />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/mentor/sessions/:mentorId"
        element={
          <DashboardLayout>
            <ManageRequests />
          </DashboardLayout>
        }
      />
      {/* Mentee */}
      <Route
        path="/dashboard/mentee"
        element={
          <DashboardLayout>
            <MenteeDashboard />
          </DashboardLayout>
        }
      />
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
