import type { ReactElement } from 'react';
import type { Tunnel } from '../../../../types';
import { calculateUptime, formatDate } from '../../../../utils/formatters';

export function TunnelStats({ tunnel }: { tunnel: Tunnel }): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat-card">
        <p className="text-sm text-slate-400 mb-2">Total Requests</p>
        <p className="text-3xl font-display font-bold text-white">{tunnel?.request_count}</p>
      </div>
      <div className="stat-card">
        <p className="text-sm text-slate-400 mb-2">Last Activity</p>
        <p className="text-3xl font-display font-bold text-green-400">
          {tunnel?.last_activity ? formatDate(tunnel?.last_activity) : 'N/A'}
        </p>
      </div>
      <div className="stat-card">
        <p className="text-sm text-slate-400 mb-2">Uptime</p>
        <p className="text-3xl font-display font-bold text-white">{calculateUptime(tunnel)}</p>
      </div>
    </div>
  );
}
