import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiList,
  FiClock,
  FiLoader,
  FiCheckCircle,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

import taskService from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { formatDate, isOverdue } from "../utils/formatDate";

/**
 * Dashboard page.
 * Shows statistics, a progress bar, recent tasks, upcoming deadlines
 * and overdue tasks.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all of the user's tasks once when the page opens.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await taskService.getTasks();
        setTasks(res.data);
      } catch (error) {
        toast.error("Unable to load your tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;

  // --- Calculate statistics from the task list ---
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  // Progress = completed / total * 100 (rounded). Avoid dividing by zero.
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Recent tasks: the five most recently created.
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Upcoming deadlines: not completed, sorted by nearest due date.
  const upcoming = [...tasks]
    .filter((t) => t.status !== "Completed" && !isOverdue(t.dueDate, t.status))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Overdue tasks.
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Here is an overview of your academic tasks.
          </p>
        </div>
        <Link to="/tasks/add" className="btn-primary w-fit">
          <FiPlus /> Add New Task
        </Link>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={total}
          icon={<FiList size={22} />}
          color="indigo"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={<FiClock size={22} />}
          color="yellow"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<FiLoader size={22} />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={<FiCheckCircle size={22} />}
          color="green"
        />
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Overall Progress</h2>
          <span className="text-sm font-medium text-indigo-600">
            {progress}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {completed} of {total} tasks completed
        </p>
      </div>

      {/* Two columns: recent tasks + upcoming deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent tasks */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li key={task._id}>
                  <Link
                    to={`/tasks/${task._id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-700">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400">{task.subject}</p>
                    </div>
                    <span className="ml-2 flex-shrink-0 text-xs text-slate-400">
                      {formatDate(task.dueDate)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">
            Upcoming Deadlines
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming deadlines.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-700">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400">{task.subject}</p>
                  </div>
                  <span className="ml-2 flex-shrink-0 text-xs font-medium text-indigo-600">
                    {formatDate(task.dueDate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Overdue tasks */}
      {overdue.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-red-700">
            <FiAlertCircle size={20} />
            <h2 className="font-semibold">
              Overdue Tasks ({overdue.length})
            </h2>
          </div>
          <ul className="space-y-2">
            {overdue.map((task) => (
              <li key={task._id}>
                <Link
                  to={`/tasks/${task._id}`}
                  className="flex items-center justify-between rounded-lg bg-white p-3 hover:bg-red-100/40"
                >
                  <span className="truncate font-medium text-slate-700">
                    {task.title}
                  </span>
                  <span className="ml-2 flex-shrink-0 text-xs font-medium text-red-600">
                    Due {formatDate(task.dueDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
