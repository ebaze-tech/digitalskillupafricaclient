import React, { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate, Outlet } from "react-router-dom";
import {
  LogOut,
  User,
  Calendar,
  Home,
  UserPlus2,
  Clock,
  Menu,
  X,
  UsersRoundIcon,
  EyeIcon,
  FileEditIcon,
} from "lucide-react";

interface Props {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditProfile = () => navigate("/profile/edit");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const renderLinks = () => {
    switch (user?.role) {
      case "admin":
        return (
          <>
            <DashboardLink
              href="/admin"
              icon={<Home size={18} />}
              label="Home"
            />
            <DashboardLink
              href="/admin/users"
              icon={<User size={18} />}
              label="Manage Users"
            />
            <DashboardLink
              href="/admin/matches/assign"
              icon={<UserPlus2 size={18} />}
              label="Assign Mentor"
            />
            <DashboardLink
              href="/admin/sessions"
              icon={<Calendar size={18} />}
              label="View Sessions"
            />
            <DashboardLink
              href="/admin/matches"
              icon={<EyeIcon size={18} />}
              label="Mentorship Match"
            />
          </>
        );
      case "mentor":
        return (
          <>
            <DashboardLink
              href="/dashboard/mentor"
              icon={<Home size={18} />}
              label="Dashboard"
            />
            <DashboardLink
              href="/dashboard/mentor/availability"
              icon={<Clock size={18} />}
              label="Set Availability"
            />
            <DashboardLink
              href="/dashboard/mentor/sessions"
              icon={<Calendar size={18} />}
              label="My Sessions"
            />
            <DashboardLink
              href="/dashboard/mentor/assigned-mentees"
              icon={<UsersRoundIcon size={18} />}
              label="My Mentees"
            />
          </>
        );
      case "mentee":
        return (
          <>
            <DashboardLink
              href="/dashboard/mentee"
              icon={<Home size={18} />}
              label="Dashboard"
            />
            <DashboardLink
              href="/dashboard/mentee/mentors"
              icon={<UserPlus2 size={18} />}
              label="Connect Mentor"
            />
            <DashboardLink
              href="/dashboard/mentee/my-sessions"
              icon={<Calendar size={18} />}
              label="My Sessions"
            />
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
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-gradient-to-br ${mainBg} overflow-hidden`}
    >
      {/* Mobile Navbar */}
      <div className="flex justify-between items-center p-4 md:hidden bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">
          Hello, {user?.username}
        </h2>
        <button onClick={toggleSidebar} className="text-gray-700">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-tr ${sidebarBg} text-black p-6 shadow-xl border-r border-black`}
      >
        <h2 className="text-xl font-bold mb-10 tracking-wide hidden md:block">
          Hello, {user?.username}
        </h2>

        <ul className="space-y-3 text-sm font-medium">{renderLinks()}</ul>

        <div className="mt-10 space-y-4">
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-3 py-2 rounded border-2 border-black bg-inherit text-black w-full hover:bg-white/10 transition cursor-pointer"
          >
            <FileEditIcon size={18} />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded bg-red-500 text-black w-full hover:bg-red-600 transition cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}

function DashboardLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center gap-2 px-3 py-2 rounded border-2 border-black hover:bg-white/10 transition"
      >
        {icon}
        {label}
      </a>
    </li>
  );
}
