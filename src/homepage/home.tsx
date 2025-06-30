import React from "react";
import { useAuth } from "../authContext";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.username || "Guest"}</h1>
      {user ? (
        <button onClick={logout}></button>
      ) : (
        <p>Please login or register</p>
      )}
    </div>
  );
};

export default HomePage;
