import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { TunnelListItemProps } from '../../../../types';
import { formatDate } from '../../../../utils/formatters';
import { StatusIndicator } from '../../../shared/StatusIndicator';
import { StatusBadge } from '../../../shared/StatusBadge';

export function TunnelListItem({ tunnel, isActive, onDelete, deletingInProgress = false }: TunnelListItemProps) {
  return (
    <div className="p-6 hover:bg-slate-800/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <StatusIndicator status={tunnel.status === 'active' ? 'active' : 'inactive'} animated={isActive} />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-display text-lg font-semibold text-white">{tunnel.public_url}</h3>
              <StatusBadge status={tunnel.status === 'active' ? 'active' : 'inactive'} uppercase>
                {tunnel.status}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Local Port</p>
                <p className="font-display text-sm text-slate-300">{tunnel.local_port}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Requests</p>
                <p className="font-display text-sm text-slate-300">{tunnel.request_count}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="font-display text-sm text-slate-300">{formatDate(tunnel.created_at)}</p>
              </div>
            </div>

            {tunnel.last_activity && isActive && (
              <p className="text-xs text-slate-500 mt-3">Last activity: {formatDate(tunnel.last_activity)}</p>
            )}
          </div>
        </div>

        {isActive ? (
          <Link
            to={`/dashboard/tunnels/${tunnel.id}`}
            className="btn btn-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View Details
          </Link>
        ) : tunnel.status === 'inactive' && onDelete ? (
          <div className="flex gap-5">
            <Link
              to={`/dashboard/tunnels/${tunnel.id}`}
              className="btn btn-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
            </Link>
            <button
              onClick={(e) => onDelete(tunnel, e)}
              disabled={deletingInProgress}
              className="flex gap-2 cursor-pointer btn btn-danger text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete tunnel"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <button disabled={true} className="flex gap-2 btn opacity-0">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
