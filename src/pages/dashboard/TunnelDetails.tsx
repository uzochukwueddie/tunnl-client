import { lazy, Suspense, useCallback, useEffect, useState, useTransition, type ReactElement } from 'react';
import { tunnelService } from '../../services/tunnel.service';
import { requestLogService } from '../../services/request-log.service';
import { useParams } from 'react-router-dom';
import type { TunnelDetailsAndLogs } from '../../types';

const TunnelHeader = lazy(() =>
  import('../../components/pages/dashboard/tunnel-details/TunnelHeader').then((m) => ({ default: m.TunnelHeader }))
);
const TunnelStats = lazy(() =>
  import('../../components/pages/dashboard/tunnel-details/TunnelStats').then((m) => ({ default: m.TunnelStats }))
);
const RequestLogsTable = lazy(() =>
  import('../../components/pages/dashboard/tunnel-details/RequestLogsTable').then((m) => ({
    default: m.RequestLogsTable
  }))
);

async function loadTunnelDetails(tunnelId: string) {
  const [tunnelDetailsRes, tunnelRequestLogsRes] = await Promise.all([
    tunnelService.getTunnelDetails(tunnelId),
    requestLogService.getRequestLogsByTunnelId(tunnelId, 20)
  ]);
  return {
    tunnelDetailsResponse: tunnelDetailsRes.result,
    tunnelRequestLogsResponse: tunnelRequestLogsRes.result
  };
}

export function TunnelDetails(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const [tunnel, setTunnel] = useState<TunnelDetailsAndLogs>({
    details: null,
    logs: []
  });

  const [isLoadingTunnel, startTunnelTransition] = useTransition();

  const loadTunnel = useCallback((tunnelId: string) => {
    startTunnelTransition(async () => {
      try {
        const response = await loadTunnelDetails(tunnelId);
        console.log(response);
        setTunnel({
          details: response.tunnelDetailsResponse,
          logs: response.tunnelRequestLogsResponse
        });
      } catch (error) {
        console.log('Failed to load tunnel:', error);
      }
    });
  }, []);

  useEffect(() => {
    if (id) {
      loadTunnel(id);
    }
  }, [id, loadTunnel]);

  if (isLoadingTunnel && !tunnel) {
    return (
      <div className="card animate-pulse">
        <div className="card-body space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    );
  }
  if (!tunnel) {
    return (
      <div className="card">
        <div className="card-body text-center py-16">
          <p className="text-slate-500">Tunnel not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense
        fallback={
          <div className="card animate-pulse">
            <div className="card-body space-y-4">
              <div className="h-8 bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        }
      >
        <TunnelHeader tunnel={tunnel.details!} />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        }
      >
        <TunnelStats tunnel={tunnel.details!} />
      </Suspense>

      <Suspense
        fallback={
          <div className="card">
            <div className="card-body p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-16 h-4 bg-slate-800 rounded"></div>
                  <div className="flex-1 h-4 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <RequestLogsTable requestLogs={tunnel.logs} loading={isLoadingTunnel} />
      </Suspense>
    </div>
  );
}
