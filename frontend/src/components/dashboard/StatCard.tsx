import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  colorClass?: string;
  glowClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-brand-500",
  glowClass = "bg-brand-500/10",
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300">
      {/* Background glow bubble */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${glowClass} blur-xl group-hover:scale-125 transition-transform duration-500`} />
      
      <div className="space-y-2">
        <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      </div>
      
      <div className={`p-4 rounded-2xl bg-dark-900/60 border border-dark-750 ${colorClass} group-hover:bg-dark-750 transition-colors shadow-md`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
