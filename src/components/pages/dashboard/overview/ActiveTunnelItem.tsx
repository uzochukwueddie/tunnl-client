import type { ReactElement } from 'react';
import type { ActiveTunnelItemProps } from '../../../../types';
import { StatusIndicator } from '../../../shared/StatusIndicator';
import { Link } from 'react-router-dom';

export function ActiveTunnel({ tunnel }: ActiveTunnelItemProps): ReactElement {
  return (
    <div className="p-6 hover:bg-slate-800/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Status Indicator */}
          <StatusIndicator status="active" animated />
          <div>
            <h4 className="font-display font-semibold text-white text-lg">{tunnel.public_url}</h4>
            <p className="text-sm text-slate-400 mt-1">
              Port {tunnel.local_port} • {tunnel.created_at}
            </p>
            <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
              <span>{tunnel.request_count} requests</span>
              {tunnel.last_activity && <span>Last activity: {tunnel.last_activity}</span>}
            </div>
          </div>
        </div>
        <Link
          to={`/dashboard/tunnels/${tunnel.id}`}
          className="text-tunnel-400 hover:text-tunnel-300 text-sm font-medium transition-colors"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}
