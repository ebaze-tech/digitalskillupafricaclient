import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";

interface Mentee {
  userId: string;
  username: string;
  email: string;
  role?: string;
}
export default function FetchMentee() {
  const [mentee, setMentor] = useState<Mentee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const menteeId = user?.roleId;
  console.log(menteeId);

  useEffect(() => {
    if (!menteeId) return;

    const fetchMentee = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentee/info/${menteeId}`);
        setMentor(response.data);
        toast.success(response?.data?.message);
      } catch (error: any) {
        console.error("Error fetching mentee data", error);
        const message =
          error?.response?.data?.message || "Error fetching mentee data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, [menteeId]);
  console.log(mentee);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {mentee ? `Welcome, ${mentee?.username}` : "Mentor Dashboard"}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading mentee dashboard...</p>
      ) : !mentee ? (
        <p className="text-red-500">Mentor details not found.</p>
      ) : (
        <div className="bg-inherit rounded shadow p-6 border border-black">
          <p className="text-lg font-semibold text-black">{mentee?.username}</p>
          <p className="text-sm text-white">User ID: {mentee?.userId}</p>
          {mentee?.role && (
            <p className="text-sm text-blue-600 font-medium">
              Role: {mentee?.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
