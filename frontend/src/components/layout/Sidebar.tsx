import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, User } from "lucide-react";
import useAuthStore from "../../store/authStore";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const menuItems = [
    ...(user?.role === "manager" ? [{ name: "Dashboard", path: "/", icon: LayoutDashboard }] : []),
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-dark-800/80 min-h-[calc(100vh-73px)] hidden md:flex flex-col p-4 space-y-2">
      <div className="text-xs font-semibold text-dark-500 uppercase px-3 py-2 tracking-wider">
        Navigation
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-brand-500/10 border-brand-500/20 text-brand-400 dark-glow"
                  : "border-transparent text-dark-300 hover:text-dark-100 hover:bg-dark-800/50"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-brand-400" : "text-dark-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 bg-dark-900/40 rounded-xl border border-dark-750 text-center">
        <p className="text-xs text-dark-400">Task Management System</p>
        <p className="text-[10px] text-dark-500 mt-1">v2.0 • production</p>
      </div>
    </aside>
  );
};

export default Sidebar;
