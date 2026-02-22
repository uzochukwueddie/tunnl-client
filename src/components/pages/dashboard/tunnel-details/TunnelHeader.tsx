import { Link } from 'react-router-dom';
import type { Tunnel } from '../../../../types';
import { MoveLeft } from 'lucide-react';
import { StatusBadge } from '../../../shared/StatusBadge';

export function TunnelHeader({ tunnel }: { tunnel: Tunnel }) {
  const getTunnelProtocol = (): string => {
    const protocol = tunnel?.public_url.split('://')[0];
    return protocol?.toUpperCase() || '';
  };

  return (
    <>
      <Link
        to="/dashboard/tunnels"
        className="inline-flex items-center text-tunnel-400 hover:text-tunnel-300 transition-colors"
      >
        <MoveLeft className="w-5 h-5 mr-2" />
        Back to Tunnels
      </Link>

      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`status-indicator ${tunnel?.status === 'active' ? 'status-active' : 'status-inactive'}`}
              ></div>
              <h2 className="text-2xl font-display font-bold text-white">{tunnel?.subdomain}</h2>
              <StatusBadge status={tunnel?.status}>{tunnel?.status}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Public URL</p>
              <a
                href={tunnel?.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium font-display text-tunnel-400 hover:underline"
              >
                {tunnel?.public_url}
              </a>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Local Port</p>
              <p className="font-display text-white text-lg">{tunnel?.local_port}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Protocol</p>
              <p className="font-display text-white text-lg uppercase">{getTunnelProtocol()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
