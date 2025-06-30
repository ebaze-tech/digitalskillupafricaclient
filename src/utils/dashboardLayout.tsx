import React from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Calendar,
  Home,
  UserPlus2,
  Clock,
  Search,
} from "lucide-react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderLinks = () => {
    switch (user?.role) {
      case "admin":
        return (
          <>
            <li>
              <a href="/dashboard/admin" className="dashboard-link">
                <Home size={18} />
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard/admin/users" className="dashboard-link">
                <User size={18} />
                Manage Users
              </a>
            </li>
            <li>
              <a
                href="/dashboard/admin/assign-mentor"
                className="dashboard-link"
              >
                <UserPlus2 size={18} />
                Assign Mentor
              </a>
            </li>
            <li>
              <a href="/dashboard/admin/sessions" className="dashboard-link">
                <Calendar size={18} />
                View Sessions
              </a>
            </li>
          </>
        );

      case "mentor":
        return (
          <>
            <li>
              <a href="/dashboard/mentor" className="dashboard-link">
                <Home size={18} />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dashboard/mentor/availability"
                className="dashboard-link"
              >
                <Clock size={18} />
                Set Availability
              </a>
            </li>
            <li>
              <a href="/dashboard/mentor/sessions" className="dashboard-link">
                <Calendar size={18} />
                My Sessions
              </a>
            </li>
          </>
        );

      case "mentee":
        return (
          <>
            <li>
              <a href="/dashboard/mentee" className="dashboard-link">
                <Home size={18} />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dashboard/mentee/view-mentors"
                className="dashboard-link"
              >
                <Search size={18} />
                Browse Mentors
              </a>
            </li>
          </>
        );

      default:
        return null;
    }
  };

  const bgClassMap: Record<string, string> = {
    admin: "from-yellow-100 via-yellow-200 to-yellow-300",
    mentor: "from-green-100 via-green-200 to-green-300",
    mentee: "from-purple-100 via-purple-200 to-purple-300",
  };

  const sidebarBgMap: Record<string, string> = {
    admin: "from-yellow-500 via-yellow-700 to-yellow-500",
    mentor: "from-green-600 via-green-800 to-green-600",
    mentee: "from-purple-600 via-purple-800 to-purple-600",
  };

  const mainBg = bgClassMap[user?.role ?? "mentee"];
  const sidebarBg = sidebarBgMap[user?.role ?? "mentee"];

  return (
    <div className={`flex min-h-screen bg-gradient-to-br ${mainBg}`}>
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gradient-to-tr ${sidebarBg} text-white p-6 shadow-xl border border-r-2 border-black`}
      >
        <h2 className="text-xl font-bold mb-10 tracking-wide text-black">
          Hello, {user?.username}
        </h2>

        <ul className="space-y-3 text-sm font-medium">{renderLinks()}</ul>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition text-black w-full text-left cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
