// components/Navbar.tsx
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">MentorMatch Admin</div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Logged in as: <span className="text-blue-700">{user.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
