import { DomainEvent } from "@dddforum/core";
import { EventBus } from "../ports/eventBus";

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

export class InMemoryEventBus implements EventBus {
  private subscriptions: Map<string, Array<EventHandler<DomainEvent>>> = new Map();

  async initialize(): Promise<void> {
    // No-op for in-memory implementation
  }

  async stop(): Promise<void> {
    // No-op for in-memory implementation
  }

  async publishEvents(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventType = event.constructor.name;
      const handlers = this.subscriptions.get(eventType);
  
      if (handlers) {
        console.log(`Publishing event: ${eventType}`);
        for (const handler of handlers) {
          await handler(event);
        }
      }
    }
  }

  async subscribe<T extends DomainEvent>(
    eventTypeName: string,
    handler: (event: T) => Promise<void>,
    options?: { durableName?: string }
  ): Promise<void> {
    const handlers = this.subscriptions.get(eventTypeName) || [];
    handlers.push(handler as EventHandler<DomainEvent>);
    this.subscriptions.set(eventTypeName, handlers);
  }

  unsubscribe(eventTypeName: string, handler: (event: DomainEvent) => void): void {
    const handlers = this.subscriptions.get(eventTypeName);

    if (handlers) {
      const index = handlers.indexOf(handler as EventHandler<DomainEvent>);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}
