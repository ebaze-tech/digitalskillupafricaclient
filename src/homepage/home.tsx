import React, { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLink = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="text-gray-700 hover:text-blue-600 px-4 py-2 font-medium"
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            MentorLink
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink label="Home" onClick={() => navigate("/")} />
            {user ? (
              <>
                <NavLink label="Dashboard" onClick={() => navigate("/dashboard")} />
                <NavLink label="Logout" onClick={handleLogout} />
              </>
            ) : (
              <>
                <NavLink label="Login" onClick={() => navigate("/login")} />
                <NavLink label="Register" onClick={() => navigate("/register")} />
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-2 bg-white px-4 py-3 rounded shadow">
            <NavLink label="Home" onClick={() => { navigate("/"); setMenuOpen(false); }} />
            {user ? (
              <>
                <NavLink label="Dashboard" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }} />
                <NavLink label="Logout" onClick={() => { handleLogout(); setMenuOpen(false); }} />
              </>
            ) : (
              <>
                <NavLink label="Login" onClick={() => { navigate("/login"); setMenuOpen(false); }} />
                <NavLink label="Register" onClick={() => { navigate("/register"); setMenuOpen(false); }} />
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full text-center bg-white/80 backdrop-blur-lg border border-gray-300 rounded-xl shadow-xl p-10">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Empower Your Growth with Mentorship
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join a community of learners and mentors. Accelerate your growth through guidance and support.
          </p>

          {user ? (
            <div>
              <p className="text-xl text-gray-700 font-medium mb-6">
                Welcome back, <span className="font-semibold">{user.username}</span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left mt-10">
            {[
              {
                title: "Expert Mentors",
                desc: "Connect with industry experts who are eager to help you grow.",
              },
              {
                title: "Structured Guidance",
                desc: "Clear goals, regular check-ins, and personalized advice.",
              },
              {
                title: "Flexible & Accessible",
                desc: "Connect anytime, anywhere. Tailored to your schedule.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your profile as a mentor or mentee.",
              },
              {
                step: "2",
                title: "Connect",
                desc: "Send or accept mentorship requests.",
              },
              {
                step: "3",
                title: "Grow",
                desc: "Work together to achieve your goals.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl font-bold text-blue-500 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 text-center border-t border-gray-200 text-sm text-gray-600">
        © {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
