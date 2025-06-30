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
  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const menteeId = user?.roleId;

  useEffect(() => {
    if (!menteeId) return;

    const fetchMentee = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/mentorship/mentee/info/${menteeId}`);
        setMentee(response.data);
        toast.success("Mentee profile loaded");
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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {mentee ? `Welcome, ${mentee.username}` : "Mentee Dashboard"}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading your details...</p>
      ) : !mentee ? (
        <p className="text-red-500">Mentee details not found.</p>
      ) : (
        <div className="bg-white border border-gray-300 rounded shadow p-6 space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {mentee.username}
          </p>
          <p className="text-sm text-gray-600">Email: {mentee.email}</p>
          <p className="text-sm text-gray-600">User ID: {mentee.userId}</p>
          {mentee.role && (
            <p className="text-sm font-medium text-blue-600">
              Role: {mentee.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
