/**
 * A small statistics card used on the Dashboard.
 * "color" controls the accent colour of the icon circle.
 */
const StatCard = ({ title, value, icon, color = "indigo" }) => {
  // Map a colour name to Tailwind classes so the card stays simple to use.
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
