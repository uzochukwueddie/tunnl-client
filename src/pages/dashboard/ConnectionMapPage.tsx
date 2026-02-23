import { lazy, useCallback, useEffect, useMemo, type ReactElement } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTunnelRealTimeEvents } from '../../hooks/useTunnelRealTimeEvents';
import { tunnelWebsocketService } from '../../services/socket-connections/tunnels-websocket.service';
import { monitoringWebsocketService } from '../../services/socket-connections/monitoring-webscoket.service';

const TunnelSelector = lazy(() =>
  import('../../components/pages/dashboard/connection-map/TunnelSelector').then((m) => ({
    default: m.TunnelSelector
  }))
);

const ConnectionMap = lazy(() =>
  import('../../components/pages/dashboard/connection-map/ConnectionMap').then((m) => ({
    default: m.ConnectionMap
  }))
);

export function ConnectionMapPage(): ReactElement {
  const { tunnelId } = useParams<{ tunnelId: string }>();
  const navigate = useNavigate();

  const selectedTunnelId = useMemo(() => tunnelId ?? null, [tunnelId]);

  const { tunnels, tunnelStatus, error } = useTunnelRealTimeEvents(selectedTunnelId);

  const handleSelectTunnel = useCallback(
    (nextTunnelId: string) => {
      navigate(`/dashboard/connection-map/${nextTunnelId}`);
    },
    [navigate]
  );

  useEffect(() => {
    tunnelWebsocketService.setupTunnelSocketConnection();

    return () => {
      tunnelWebsocketService.tunnelSocketDisconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedTunnelId) return;

    monitoringWebsocketService.setupSocketConnection(selectedTunnelId);

    return () => {
      monitoringWebsocketService.monitoringSocketDisconnect();
    };
  }, [selectedTunnelId]);

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <Link to="/dashboard" className="flex items-center justify-between">
          <div>
            <div>
              <h1 className="text-2xl font-bold text-white">Connection Map</h1>
              <p className="text-sm text-slate-400 mt-1">Real-time visualization of tunnel connections</p>
            </div>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tunnel Selector */}
        <aside className="w-80 shrink-0">
          <TunnelSelector tunnels={tunnels} selectedTunnelId={selectedTunnelId} onSelectTunnel={handleSelectTunnel} />
        </aside>

        {/* Center Panel - Connection Map */}
        <main className="flex-1 p-6 relative">
          {error ? (
            <div className="h-full flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-400 font-medium">{error}</p>
                <p className="text-slate-500 text-sm mt-2">Please try selecting a different tunnel</p>
              </div>
            </div>
          ) : !selectedTunnelId ? (
            <div className="h-full flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-slate-400 text-lg font-medium">Select a tunnel to view connection map</p>
                <p className="text-slate-500 text-sm mt-2">Choose a tunnel from the left panel</p>
              </div>
            </div>
          ) : (
            <ConnectionMap activeTunnelStatus={tunnelStatus} />
          )}
        </main>
      </div>
    </div>
  );
}
