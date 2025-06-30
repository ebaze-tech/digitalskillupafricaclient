import React, { createContext, useContext, useState, useEffect } from "react";

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
  skills?: string;
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

type User = Admin | Mentee | Mentor;

interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
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

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

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

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>."
    );
  }
  return context;
};

// Type guards for role-based authorization
export const isMentee = (user: User | null): user is Mentee => {
  return !!user && user.role === "mentee";
};

export const isMenteeWithMentor = (
  user: User | null
): user is Mentee & { mentorId: string } => {
  return (
    isMentee(user) && "mentorId" in user && typeof user.mentorId === "string"
  );
};

export const isMentor = (user: User | null): user is Mentor => {
  return !!user && user.role === "mentor";
};

export const isAdmin = (user: User | null): user is Admin => {
  return !!user && user.role === "admin";
};
