import EventEmitter from 'eventemitter3';
import type { EventType } from './types';

class EventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  publish<T>(eventType: EventType, payload?: T): void {
    this.emitter.emit(eventType, payload);
  }

  subscribe<T>(eventType: EventType, handler: (payload?: T) => void) {
    this.emitter.on(eventType, handler);
  }

  unsubscribe<T>(eventType: EventType, handler: (payload?: T) => void) {
    this.emitter.off(eventType, handler);
  }
}

export const eventBus = new EventBus();
