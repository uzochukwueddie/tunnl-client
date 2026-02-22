import type { StatCardProps } from '../../../../types';

export function StatCard({ title, value, icon, iconColor = 'text-tunnel-500' }: StatCardProps) {
  return (
    <div className="stat-card group hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="text-3xl font-display font-bold text-white">{value}</div>
    </div>
  );
}
