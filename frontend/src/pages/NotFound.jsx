import { Link } from "react-router-dom";

/**
 * 404 Not Found page.
 * Shown when the URL does not match any route.
 */
const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 text-center">
      <h1 className="text-7xl font-extrabold text-indigo-600">404</h1>
      <p className="mt-4 text-xl font-semibold text-slate-800">
        Page Not Found
      </p>
      <p className="mt-2 max-w-sm text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
