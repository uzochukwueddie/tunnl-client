import { Link } from 'react-router-dom';
import type { QuickActionCardProps } from '../../../../types';

export function QuickActionCard({
  to,
  icon,
  title,
  description,
  iconBgColor = 'bg-tunnel-500/20',
  iconHoverColor = 'group-hover:bg-tunnel-500/30'
}: QuickActionCardProps) {
  return (
    <Link to={to} className="card hover:border-tunnel-500/50 transition-all group">
      <div className="card-body">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center ${iconHoverColor} transition-colors`}
          >
            {icon}
          </div>
          <div>
            <h4 className="font-medium text-white">{title}</h4>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
