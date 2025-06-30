import { useEffect, useState } from "react";
import { useAuth, isAdmin, isMentee, isMentor } from "../authContext";
import fetchMentor from "../utils/mentor/fetchMentor";
import fetchMentee from "../utils/mentee/fetchMentee";
import fetchAdmin from "../utils/admin/fetchAdmin";
export const useRoleData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin(user)) {
          const adminData = fetchAdmin(user.adminId);
          setData(adminData);
        } else if (isMentor(user)) {
          const mentorData = fetchMentor(user.mentorId);
          setData(mentorData);
        } else if (isMentee(user)) {
          const menteeData = fetchMentee(user.menteeId);
          setData(menteeData);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return { data, loading };
};
