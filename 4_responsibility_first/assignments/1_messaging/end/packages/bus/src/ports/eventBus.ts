import { DomainEvent } from "@dddforum/core";

export interface EventBus {
  initialize(): Promise<void>;
  stop(): Promise<void>;
  publishEvents(events: DomainEvent[]): Promise<void> | void;
  subscribe<T extends DomainEvent>(
    eventTypeName: string,
    handler: (event: T) => Promise<void>,
    options?: { durableName?: string }
  ): Promise<void>;
  unsubscribe(eventTypeName: string, handler: (event: DomainEvent) => void): void;
}
