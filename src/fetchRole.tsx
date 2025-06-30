import { useRoleData } from "./hooks/useRoleData";
import { useAuth } from "./authContext";

const RoleFetcher = () => {
  const { user } = useAuth();
  const { data, loading } = useRoleData();

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;

  return (
    <div>
      <h2>Welcome, {user?.username}!</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default RoleFetcher;
