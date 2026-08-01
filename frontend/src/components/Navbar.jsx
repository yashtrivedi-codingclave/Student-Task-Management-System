import { Link } from "react-router-dom";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

/**
 * Top navigation bar used inside the dashboard layout.
 *
 * Props:
 * - onMenuClick: opens the sidebar on mobile devices
 */
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left side: mobile menu button + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={22} />
        </button>
        <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
          TaskManager
        </Link>
      </div>

      {/* Right side: student name + profile + logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-slate-600 sm:block">
          Hi, <span className="font-medium">{user?.name}</span>
        </span>
        <Link
          to="/profile"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          title="Profile"
        >
          <FiUser size={20} />
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <FiLogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
