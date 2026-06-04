import React from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { CheckSquare, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-dark-800/80 bg-dark-950/80 backdrop-blur-md">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
          <CheckSquare className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-dark-100 to-brand-400">
          TaskFlow
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/profile"
          className="flex items-center space-x-3 hover:bg-dark-800/50 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-dark-700/40"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {getInitials(user?.full_name || user?.username)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-dark-100">{user?.full_name || user?.username}</p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs text-dark-400 font-normal">@{user?.username}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                user?.role === "manager"
                  ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={logout}
          title="Logout"
          className="p-2.5 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
