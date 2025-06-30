import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";

interface Mentor {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

export default function FetchMentor() {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  // console.log(user?.roleId);
  // const roleId = user?.roleId;
  // console.log(roleId);

  const mentorId = user?.roleId;
  console.log(mentorId);

  useEffect(() => {
    if (!mentorId) return;

    const fetchMentor = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentor/info/${mentorId}`);
        console.log(response.data + "Mentor");
        setMentor(response.data);
        toast.success(response?.data?.message);
      } catch (error: any) {
        console.error("Error fetching mentor data", error);
        const message =
          error?.response?.data?.message || "Error fetching mentor data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);
  console.log(mentor);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {mentor ? `Welcome, ${mentor?.username}` : "Mentor Dashboard"}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading mentor dashboard...</p>
      ) : !mentor ? (
        <p className="text-red-500">Mentor details not found.</p>
      ) : (
        <div className="bg-inherit rounded shadow p-6 border border-black">
          <p className="text-lg font-semibold text-black">{mentor?.username}</p>
          <p className="text-sm text-white">User ID: {mentor?.userId}</p>
          {mentor?.role && (
            <p className="text-sm text-blue-600 font-medium">
              Role: {mentor?.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
