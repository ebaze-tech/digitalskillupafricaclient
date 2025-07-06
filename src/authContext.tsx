import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * User role interfaces with optional profile fields.
 * Each role (Admin, Mentee, Mentor) extends the base shape of a User.
 */

interface Admin {
  id: string;
  username: string;
  email: string;
  adminId: string;
  role: "admin";
  roleId: string;
  mentorId?: string;
  shortBio?: string;
  industry?: string;
  experience?: string;
  goals?: string;
  skills?: string; // Consider using string[] for consistency
  availability?: string;
}

interface Mentee {
  id: string;
  username: string;
  email: string;
  menteeId: string;
  role: "mentee";
  roleId: string;
  mentorId?: string;
  shortBio?: string;
  industry?: string;
  experience?: string;
  goals?: string;
  skills?: string;
  availability?: string;
}

interface Mentor {
  id: string;
  username: string;
  email: string;
  mentorId: string;
  role: "mentor";
  roleId: string;
  shortBio?: string;
  industry?: string;
  experience?: string;
  goals?: string;
  skills?: string;
  availability?: string;
}

// Union of all possible user types
type User = Admin | Mentee | Mentor;

// Shape of the context available to consuming components
interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context object
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * AuthProvider wraps the app and provides user data and login/logout functions.
 * It restores user state from localStorage if available on first load.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Basic shape validation
        if (
          parsedUser &&
          typeof parsedUser === "object" &&
          "id" in parsedUser &&
          "username" in parsedUser &&
          "email" in parsedUser &&
          "role" in parsedUser &&
          ["admin", "mentee", "mentor"].includes(parsedUser.role) &&
          "roleId" in parsedUser
        ) {
          setUser(parsedUser);
        } else {
          console.error("Invalid user data in localStorage");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Save user and persist to localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear user and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context throughout the app.
 * Ensures it's only used inside an <AuthProvider>.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>."
    );
  }
  return context;
};

// ---------- Type Guards for Role-Based Logic ----------

/**
 * Checks if user is a mentee.
 */
export const isMentee = (user: User | null): user is Mentee => {
  return !!user && user.role === "mentee";
};

/**
 * Checks if user is a mentee with an assigned mentor.
 */
export const isMenteeWithMentor = (
  user: User | null
): user is Mentee & { mentorId: string } => {
  return (
    isMentee(user) && "mentorId" in user && typeof user.mentorId === "string"
  );
};

/**
 * Checks if user is a mentor.
 */
export const isMentor = (user: User | null): user is Mentor => {
  return !!user && user.role === "mentor";
};

/**
 * Checks if user is an admin.
 */
export const isAdmin = (user: User | null): user is Admin => {
  return !!user && user.role === "admin";
};
