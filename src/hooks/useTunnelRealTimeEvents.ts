import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { tunnelService } from '../services/tunnel.service';
import type {
  TunnelDataAndStatus,
  TunnelLocalService,
  UseTunnelRealtimeEventsResult,
  WebSocketMessageData
} from '../types';
import { isAxiosError } from 'axios';
import { eventBus } from '../events';
import { AppEventType } from '../events/types';

async function loadTunnelData(tunnelId: string) {
  const [tunnelRes, tunnelStatusRes] = await Promise.all([
    tunnelService.getAllUserTunnels(),
    tunnelService.getTunnelStatus(tunnelId)
  ]);
  return {
    tunnelResponse: tunnelRes.result,
    tunnelStatusResponse: tunnelStatusRes.result
  };
}

export function useTunnelRealTimeEvents(tunnelId: string | null): UseTunnelRealtimeEventsResult {
  const [tunnelData, setTunnelData] = useState<TunnelDataAndStatus>({
    tunnels: [],
    status: null
  });
  const [error, setError] = useState<string | null>(null);

  const tunnelIdRef = useRef<string | null>(tunnelId);

  const [isPending, startTransition] = useTransition();

  const loadStatus = useCallback((id: string) => {
    startTransition(async () => {
      try {
        const response = await loadTunnelData(id);
        setTunnelData({
          tunnels: response.tunnelResponse,
          status: response.tunnelStatusResponse
        });
      } catch (err) {
        const errMessage = isAxiosError(err)
          ? err.response?.data.error || err.message
          : 'Failed to fetch tunnel status';
        setError(errMessage);
      }
    });
  }, []);

  useEffect(() => {
    tunnelIdRef.current = tunnelId;
  }, [tunnelId]);

  useEffect(() => {
    if (tunnelId) {
      loadStatus(tunnelId);
    }
  }, [tunnelId, loadStatus]);

  const isMonitoringWebsocketData = useCallback((payload: unknown): payload is WebSocketMessageData => {
    return Boolean(payload && typeof payload === 'object' && 'type' in payload && 'data' in payload);
  }, []);

  const isTunnelLocalService = useCallback((payload: unknown): payload is TunnelLocalService => {
    return Boolean(
      payload && typeof payload === 'object' && 'tunnelId' in payload && 'localServiceConnected' in payload
    );
  }, []);

  useEffect(() => {
    if (!tunnelId) return;

    const handleMessageEvent = (payload: unknown): void => {
      if (!isMonitoringWebsocketData(payload)) return;

      if (payload.type !== 'status_update' || !payload.data) return;

      const { tunnelId: messageTunnelId, status, lastSeen, localServiceConnected } = payload.data;

      // ignore updates for other tunnels.
      if (messageTunnelId !== tunnelIdRef.current) return;

      setTunnelData((prev) => {
        if (!prev || prev.status?.id !== messageTunnelId) return prev;

        return {
          ...prev,
          status: prev.status ? { ...prev.status, status, lastSeen, localServiceConnected } : null
        };
      });
    };

    const handleClientLocalService = (payload: unknown): void => {
      if (!isTunnelLocalService(payload)) return;

      // ignore updates for other tunnels.
      if (payload.tunnelId !== tunnelIdRef.current) return;

      setTunnelData((prev) => {
        if (!prev || prev.status?.id !== payload.tunnelId) return prev;

        return {
          ...prev,
          status: prev.status ? { ...prev.status, localServiceConnected: payload.localServiceConnected } : null
        };
      });
    };

    eventBus.subscribe(AppEventType.MESSAGE_EVENT, handleMessageEvent);
    eventBus.subscribe(AppEventType.CLIENT_LOCAL_SERVICE, handleClientLocalService);

    return () => {
      eventBus.unsubscribe(AppEventType.MESSAGE_EVENT, handleMessageEvent);
      eventBus.unsubscribe(AppEventType.CLIENT_LOCAL_SERVICE, handleClientLocalService);
    };
  }, [isMonitoringWebsocketData, isTunnelLocalService, tunnelId]);

  return {
    tunnels: tunnelData.tunnels,
    tunnelStatus: tunnelData.status,
    loading: isPending,
    error
  };
}
