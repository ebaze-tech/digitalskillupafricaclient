import { useEffect, useState } from "react";
import API from "../../axios/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext";
import {
  User,
  Mail,
  Briefcase,
  Clock,
  BadgeCheck,
  // Calendar,
} from "lucide-react";

interface Mentee {
  id: string;
  username: string;
  email: string;
  industry: string;
  experience: string;
  createdAt?: string;
  role?: string;
}

export default function AssignedMentees() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignedMentees = async () => {
      try {
        const response = await API.get("/mentorship/assigned-mentees");
        setMentees(response.data || []);
        toast.success("Assigned mentees loaded");
      } catch (error: any) {
        console.error("Error fetching assigned mentees", error);
        const message =
          error?.response?.data?.message ||
          "Error fetching assigned mentees data";
        toast.error(message);
      }
    };

    if (user?.id) {
      fetchAssignedMentees();
    }
  }, [user?.id]);

  return (
    <div className="max-w-6xl p-0 bg-white rounded-xl shadow ">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Your Assigned Mentees
      </h3>

      {mentees.length === 0 ? (
        <p className="text-gray-600 text-center">
          You have no assigned mentees.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mentees.map((m) => (
            <div
              key={m.id}
              className="border border-gray-200 p-5 rounded-lg bg-gray-50 hover:shadow-md transition space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User className="w-5 h-5 text-indigo-600" />
                  {m.username}
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  {m.role?.toUpperCase() || "MENTEE"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 break-all">
                <Mail className="w-4 h-4 text-gray-500" />
                {m.email}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Briefcase className="w-4 h-4 text-gray-500" />
                Industry: {m.industry || "N/A"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                Experience: {m.experience || "N/A"}
              </div>

              {/* {m.createdAt && (
                <Calendar className="text-xs h-5 w-3 text-gray-500 text-right">
                  Assigned on:{" "}
                  {new Date(m.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Calendar>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
