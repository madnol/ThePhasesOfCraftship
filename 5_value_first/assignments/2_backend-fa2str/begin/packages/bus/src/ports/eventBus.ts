import { DomainEvent } from "@dddforum/core";

export interface EventBus {
  initialize(): Promise<void>;
  stop(): Promise<void>;
  publishEvents(events: DomainEvent[]): void;
  subscribe<T extends DomainEvent>(eventTypeName: string, handler: (event: T) => void): void;
  unsubscribe(eventTypeName: string, handler: (event: DomainEvent) => void): void;
}
