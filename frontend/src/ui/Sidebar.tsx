import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition border";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-2">
        <NavItem to="/" label="Dashboard" />
        <NavItem to="/jobs" label="Job Management" />
        <NavItem to="/pipeline" label="Candidate Pipeline" />
      </div>
    </aside>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        linkBase +
        " " +
        (isActive
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-transparent hover:border-slate-200 hover:bg-slate-50")
      }
    >
      <span>{label}</span>
    </NavLink>
  );
}
