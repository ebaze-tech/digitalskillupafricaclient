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
      className="text-gray-700 hover:text-indigo-600 px-4 py-2 font-medium transition-colors duration-200 cursor-pointer"
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-green-100">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div
            className="text-2xl font-extrabold text-indigo-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Mentor<span className="text-green-600">Link</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink label="Home" onClick={() => navigate("/")} />
            {user ? (
              <>
                <NavLink
                  label="Dashboard"
                  onClick={() => {
                    if (user.role === "admin") {
                      navigate("/dashboard/admin");
                    } else if (user.role === "mentor") {
                      navigate("/dashboard/mentor");
                    } else if (user.role === "mentee") {
                      navigate("/dashboard/mentee");
                    } else {
                      logout();
                    }
                  }}
                />
                <NavLink label="Logout" onClick={handleLogout} />
              </>
            ) : (
              <>
                <NavLink label="Login" onClick={() => navigate("/login")} />
                <NavLink
                  label="Register"
                  onClick={() => navigate("/register")}
                />
              </>
            )}
          </div>

          <div className="md:hidden cursor-pointer">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 bg-white px-6 py-4 rounded-b-lg shadow-md transition-all duration-300">
            <NavLink
              label="Home"
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
            />
            {user ? (
              <>
                <NavLink
                  label="Dashboard"
                  onClick={() => {
                    if (user.role === "admin") {
                      navigate("/dashboard/admin");
                    } else if (user.role === "mentor") {
                      navigate("/dashboard/mentor");
                    } else if (user.role === "mentee") {
                      navigate("/dashboard/mentee");
                    } else {
                      logout();
                    }
                  }}
                />
                <NavLink
                  label="Logout"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                />
              </>
            ) : (
              <>
                <NavLink
                  label="Login"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                />
                <NavLink
                  label="Register"
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                />
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-indigo-100 to-purple-100">
        <div className="max-w-5xl w-full text-center bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Empower Your Journey with{" "}
            <span className="text-indigo-600">Mentorship</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Join a growing community of learners and mentors. Unlock your
            potential through meaningful connections.
          </p>

          {user ? (
            <div>
              <p className="text-xl text-gray-700 font-medium mb-6">
                Welcome back,{" "}
                <span className="font-semibold">{user.username}</span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose MentorLink?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Expert Mentors",
                desc: "Learn from professionals who’ve walked the path you're on.",
              },
              {
                title: "Structured Growth",
                desc: "Guided sessions, personalized advice, and real goals.",
              },
              {
                title: "Flexible Learning",
                desc: "Meet at your convenience, wherever you are.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-100 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-indigo-700">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your mentor or mentee profile.",
              },
              {
                step: "2",
                title: "Connect",
                desc: "Send or accept mentorship requests.",
              },
              {
                step: "3",
                title: "Grow",
                desc: "Achieve your goals with expert help.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="text-4xl font-bold text-indigo-500 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-600">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium">MentorLink</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
