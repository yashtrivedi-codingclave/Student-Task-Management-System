import { Link } from "react-router-dom";
import { FiCheckCircle, FiCalendar, FiSearch, FiBarChart2 } from "react-icons/fi";

/**
 * The public landing page.
 * Introduces the app and links to Login / Register.
 */
const Home = () => {
  // A simple list of features shown as cards.
  const features = [
    {
      icon: <FiCheckCircle size={22} />,
      title: "Manage Tasks",
      text: "Create, edit and complete your academic tasks with ease.",
    },
    {
      icon: <FiCalendar size={22} />,
      title: "Track Deadlines",
      text: "Set due dates and never miss an assignment again.",
    },
    {
      icon: <FiSearch size={22} />,
      title: "Search & Filter",
      text: "Quickly find tasks by status, priority or keyword.",
    },
    {
      icon: <FiBarChart2 size={22} />,
      title: "See Progress",
      text: "View simple statistics about your study progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      {/* Navigation bar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-indigo-600">TaskManager</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <header className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <FiCheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 sm:text-5xl">
          Organize Your Studies. <br /> Complete Tasks on Time.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          Manage assignments, projects and study tasks from one simple dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-indigo-200 bg-white px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
          >
            I already have an account
          </Link>
        </div>
      </header>

      {/* Features section */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold text-slate-800">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="pb-8 text-center text-sm text-slate-400">
        Student Task Management System &middot; MERN Stack Project
      </footer>
    </div>
  );
};

export default Home;
