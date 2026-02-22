import { io, type Socket } from 'socket.io-client';
import { environment } from '../../config/environment';
import type { WebSocketMessageData } from '../../types';
import { eventBus } from '../../events';
import { AppEventType } from '../../events/types';
import { safeParseJson } from '../../utils/utils';

export class MonitoringWebsocketService {
  private socket: Socket | null = null;
  private currentTunnelId: string | null = null;
  private listenersBound = false;

  setupSocketConnection(tunnelId: string): void {
    if (this.socket?.connected && this.currentTunnelId === tunnelId) {
      return;
    }

    if (this.socket && this.currentTunnelId !== tunnelId) {
      this.teardownSocket('Tunnel ID changed');
    }

    this.currentTunnelId = tunnelId;

    this.socket = io(`${environment.wsUrl}/monitoring`, {
      transports: ['websocket'],
      query: { tunnelId },
      secure: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    this.bindSocketListenersOnce();
    this.socket.connect();
  }

  monitoringSocketDisconnect(): void {
    this.teardownSocket('[Monitoring] Manual disconnect');
  }

  private bindSocketListenersOnce(): void {
    if (!this.socket || this.listenersBound) return;

    this.listenersBound = true;

    this.socket.on('connect', () => {
      console.log('[Monitoring] Connected to server');
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log(`[Monitoring] Disconnected. Reason: ${reason}`);
    });
    /**
     * Other events
     * - connect_error
     * - reconnect_attempt
     * - reconnect_failed
     */

    this.socket.on('message', (payload: unknown) => {
      const message = safeParseJson<WebSocketMessageData>(payload);
      if (!message) return;

      eventBus.publish(AppEventType.MESSAGE_EVENT, message);
    });

    this.socket.on('client_local_service', (payload: unknown) => {
      const message = safeParseJson<unknown>(payload);
      if (!message) {
        console.warn('[Monitoring] Received empty local service data.');
        return;
      }

      eventBus.publish(AppEventType.CLIENT_LOCAL_SERVICE, message);
    });

    this.socket.on('server_shutdown', (payload: { shuttingDown: boolean }) => {
      eventBus.publish(AppEventType.SERVER_SHUTDOWN, payload);
    });
  }

  private teardownSocket(reason: string): void {
    console.log(reason);
    if (!this.socket) {
      this.currentTunnelId = null;
      this.listenersBound = false;
      return;
    }

    this.socket.removeAllListeners();
    this.socket.io.removeAllListeners();

    this.socket.disconnect();

    this.socket = null;
    this.currentTunnelId = null;
    this.listenersBound = false;
  }
}

export const monitoringWebsocketService = new MonitoringWebsocketService();
