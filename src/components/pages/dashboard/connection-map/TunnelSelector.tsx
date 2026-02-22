import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import isEqual from 'react-fast-compare';
import type { Tunnel, TunnelSelectorProps, TunnelUpdate } from '../../../../types';
import { eventBus } from '../../../../events';
import { AppEventType } from '../../../../events/types';
import { StatusBadge } from '../../../shared/StatusBadge';
import { formatDate } from '../../../../utils/formatters';

export function TunnelSelector({
  tunnels: tunnelData,
  selectedTunnelId,
  onSelectTunnel
}: TunnelSelectorProps): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [liveTunnels, setLiveTunnels] = useState<Tunnel[] | null>(null);

  const selectedIdRef = useRef<string | null>(selectedTunnelId);

  const tunnels = liveTunnels ?? tunnelData;

  useEffect(() => {
    selectedIdRef.current = selectedTunnelId;
  }, [selectedTunnelId]);

  const handleTunnelMessageEvent = useCallback(
    (payload: unknown) => {
      if (!payload || typeof payload !== 'object' || !('type' in payload)) return;

      const message = payload as TunnelUpdate;
      if (!Array.isArray(message.data)) return;

      setLiveTunnels((prev) => {
        const hasChanges = !isEqual(message.data, prev ?? tunnelData);
        return hasChanges ? message.data : prev;
      });

      setError(null);

      const selected = selectedIdRef.current;
      if (selected && !message.data.some((t) => t.id === selected) && message.data.length) {
        onSelectTunnel(message.data[0].id);
      }
    },
    [onSelectTunnel, tunnelData]
  );

  useEffect(() => {
    eventBus.subscribe(AppEventType.TUNNEL_MESSAGE_EVENT, handleTunnelMessageEvent);

    return () => {
      eventBus.unsubscribe(AppEventType.TUNNEL_MESSAGE_EVENT, handleTunnelMessageEvent);
    };
  }, [handleTunnelMessageEvent]);

  useEffect(() => {
    if (!selectedIdRef.current && tunnelData.length > 0) {
      const firstActive = tunnelData.find((t) => t.status === 'active');
      const toSelect = firstActive ?? tunnelData[0];
      selectedIdRef.current = toSelect.id;
      onSelectTunnel(toSelect.id);
    }
  }, [onSelectTunnel, tunnelData]);

  const handleSelect = useCallback(
    (id: string) => {
      onSelectTunnel(id);
    },
    [onSelectTunnel]
  );

  const tunnelCountLabel = useMemo(() => {
    const n = tunnels.length;
    return `${n} tunnel${n !== 1 ? 's' : ''}`;
  }, [tunnels.length]);

  if (error) {
    return (
      <div className="h-full bg-slate-900 border-r border-slate-800 p-4">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">Tunnels</h3>
        <p className="text-xs text-slate-400 mt-1">{tunnelCountLabel}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tunnels.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-slate-500 text-sm">No tunnels found</div>
            <p className="text-xs text-slate-600 mt-2">Create a tunnel to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tunnels.map((tunnel) => {
              const isSelected = selectedTunnelId === tunnel.id;
              const isActive = tunnel.status === 'active';

              return (
                <div key={tunnel.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleSelect(tunnel.id)}
                    className={`w-full text-left p-3 cursor-pointer rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-2 border-blue-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:bg-slate-800 hover:border-slate-700'
                    }`}
                    aria-selected={isSelected}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-white truncate">{tunnel.subdomain}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <StatusBadge status={isActive ? 'active' : 'inactive'} uppercase>
                          {tunnel.status}
                        </StatusBadge>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span>URL:</span>
                        <a
                          href={tunnel.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono overflow-hidden text-ellipsis text-tunnel-400 hover:underline whitespace-nowrap max-w-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tunnel.public_url}
                        </a>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span>ID:</span>
                        <div className="font-mono overflow-hidden text-ellipsis text-tunnel-400 whitespace-nowrap max-w-50">
                          {tunnel.id}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Port:</span>
                        <span className="font-mono">{tunnel.local_port}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Requests:</span>
                        <span className="font-mono">{tunnel.request_count}</span>
                      </div>

                      {tunnel.last_activity && (
                        <div className="text-xs text-slate-500 mt-2">Last: {formatDate(tunnel.last_activity)}</div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
