import React from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, Home, UserPlus2, Clock } from "lucide-react";

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
              <a
                href="/dashboard/admin"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <Home size={18} />
                Home
              </a>
            </li>
            <li>
              <a
                href="/dashboard/admin/users"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <User size={18} />
                Manage Users
              </a>
            </li>
            <li>
              <a
                href="/dashboard/admin/assign-mentor"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <UserPlus2 size={18} />
                Assign Mentor
              </a>
            </li>
            <li>
              <a
                href="/dashboard/admin/sessions"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
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
              <a
                href="/dashboard/mentor"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <Home size={18} />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dashboard/mentor/availability"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <Clock size={18} />
                Set Availability
              </a>
            </li>
            <li>
              <a
                href="/dashboard/mentor/sessions"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition text-black border-black border-2"
              >
                <Calendar size={18} />
                My Sessions
              </a>
            </li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-tr from-blue-500 via-green-800 to-blue-500 text-white p-6 shadow-xl border border-r-2 border-black">
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
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-tl from-blue-500 via-green-800 to-blue-500 shadow-inner">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
