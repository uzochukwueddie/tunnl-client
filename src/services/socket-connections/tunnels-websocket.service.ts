import { io, type Socket } from 'socket.io-client';
import { environment } from '../../config/environment';
import { eventBus } from '../../events';
import { AppEventType } from '../../events/types';
import { safeParseJson } from '../../utils/utils';

export class TunnelWebsocketService {
  private socket: Socket | null = null;
  private listenersBound = false;

  setupTunnelSocketConnection(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${environment.wsUrl}/tunnels`, {
      transports: ['websocket'],
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

  tunnelSocketDisconnect(): void {
    this.teardownSocket('[Tunnels] Manual disconnect');
  }

  private bindSocketListenersOnce(): void {
    if (!this.socket || this.listenersBound) return;

    this.listenersBound = true;

    this.socket.on('connect', () => {
      console.log('[Tunnels] Connected to server');
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log(`[Tunnels] Disconnected. Reason: ${reason}`);
    });
    /**
     * Other events
     * - connect_error
     * - reconnect_attempt
     * - reconnect_failed
     */

    this.socket.on('message', (payload: unknown) => {
      const message = safeParseJson(payload);
      if (!message) return;

      eventBus.publish(AppEventType.TUNNEL_MESSAGE_EVENT, message);
    });

    this.socket.on('server_shutdown', (payload: { shuttingDown: boolean }) => {
      eventBus.publish(AppEventType.SERVER_SHUTDOWN, payload);
    });
  }

  private teardownSocket(reason: string): void {
    console.log(reason);
    if (!this.socket) {
      this.listenersBound = false;
      return;
    }

    this.socket.removeAllListeners();
    this.socket.io.removeAllListeners();

    this.socket.disconnect();

    this.socket = null;
    this.listenersBound = false;
  }
}

export const tunnelWebsocketService = new TunnelWebsocketService();
