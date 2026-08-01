import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

/**
 * Sidebar navigation.
 * On desktop it is always visible; on mobile it slides in and out.
 *
 * Props:
 * - isOpen: whether the mobile sidebar is open
 * - onClose: closes the mobile sidebar
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  // The navigation links. Using an array keeps the JSX short and clean.
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid size={18} /> },
    { to: "/tasks", label: "All Tasks", icon: <FiList size={18} /> },
    { to: "/tasks/add", label: "Add Task", icon: <FiPlusCircle size={18} /> },
    { to: "/profile", label: "Profile", icon: <FiUser size={18} /> },
  ];

  // Active links are highlighted; inactive links are plain.
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <>
      {/* Dark overlay behind the sidebar on mobile. */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* The sidebar itself. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close button (mobile only) */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">TaskManager</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/tasks"}
              className={linkClass}
              onClick={onClose}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout at the bottom */}
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
