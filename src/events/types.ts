export const AppEventType = {
  MESSAGE_EVENT: 'message.event',
  CLIENT_LOCAL_SERVICE: 'client.local.service',
  TUNNEL_MESSAGE_EVENT: 'tunnel.message.event',
  SERVER_SHUTDOWN: 'server.shutdown'
};

export type EventType = (typeof AppEventType)[keyof typeof AppEventType];
