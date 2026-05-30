import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

export default function TopNav() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="py-5">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            R
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700">
              Recruitment
            </div>
            <div className="text-lg font-bold -mt-0.5">Dashboard</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {token ? (
            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
