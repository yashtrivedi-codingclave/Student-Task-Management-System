import { useEffect, useState } from "react";
import { FiUser, FiMail, FiCalendar, FiList, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import taskService from "../services/taskService";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { formatDate } from "../utils/formatDate";

/**
 * Profile page.
 * Shows the student's basic info and a couple of task statistics.
 */
const Profile = () => {
  const { fetchProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load the profile and the tasks at the same time.
        const [profileData, tasksRes] = await Promise.all([
          fetchProfile(),
          taskService.getTasks(),
        ]);
        setProfile(profileData);

        const tasks = tasksRes.data;
        setStats({
          total: tasks.length,
          completed: tasks.filter((t) => t.status === "Completed").length,
        });
      } catch (error) {
        toast.error("Unable to load your profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader text="Loading your profile..." />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

      {/* Profile card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {profile.name}
            </h2>
            <p className="text-sm text-slate-500">Student</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
          <InfoRow icon={<FiUser />} label="Full Name" value={profile.name} />
          <InfoRow icon={<FiMail />} label="Email" value={profile.email} />
          <InfoRow
            icon={<FiCalendar />}
            label="Account Created"
            value={formatDate(profile.createdAt)}
          />
        </div>
      </div>

      {/* Task statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<FiList size={22} />}
          color="indigo"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          icon={<FiCheckCircle size={22} />}
          color="green"
        />
      </div>
    </div>
  );
};

// Helper for a single info row inside the profile card.
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-indigo-500">{icon}</span>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

export default Profile;
