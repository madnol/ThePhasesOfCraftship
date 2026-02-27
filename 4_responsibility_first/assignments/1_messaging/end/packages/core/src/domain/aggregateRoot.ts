
import { DomainEvent } from "./domainEvent";

export abstract class AggregateRoot {
  protected domainEvents: DomainEvent[] = [];
  getDomainEvents () {
    return this.domainEvents;
  }

  addEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }
}
