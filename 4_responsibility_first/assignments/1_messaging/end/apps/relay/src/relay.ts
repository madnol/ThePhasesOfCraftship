
import { EventOutboxTable } from "@dddforum/outbox";
import { DomainEvent } from '@dddforum/core';
import { EventBus } from "@dddforum/bus";

export class Relay {
  private queue: DomainEvent[];
  private isProcessing = false;
  private static QUEUE_PROCESS_INTERVAL = 2000;

  constructor (
    private outboxTable: EventOutboxTable, 
    private publisher: EventBus
  ) {
    this.queue = []
  }

  public async start() {
    try {
      await this.publisher.initialize();
      setInterval(async () => {
        const newEvents = await this.outboxTable.getUnprocessedEvents();
        if (newEvents.length > 0) {
          this.addToQueue(newEvents);
        }
        this.processQueue();
      }, 2000);
    } catch (err) {
      console.log('failed to start nats', err)
    }
  }

  private addToQueue(events: DomainEvent[]): void {
    events.forEach(event => {
      const isDuplicate = this.queue.some(
        queuedEvent => queuedEvent.id
      );
      if (!isDuplicate) {
        this.queue.push(event);
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift();
      
      if (!event) {
        continue;
      }

      try {
        // Attempt to write it to RabbitMQ 
        await this.publishToQueue(event);

        // Mark it as published and save the event
        event.markPublished();
        await this.outboxTable.save([event]);
      } catch (error) {
        event.recordFailureToProcess();
        // Increment the retries and save the event
        await this.outboxTable.save([event]);
      }
    }

    this.isProcessing = false;
    }

  private async publishToQueue(event: DomainEvent): Promise<void> {
    console.log(event)
    console.log(`Publishing event to Message Broker: ${event.name} ${JSON.stringify(event.data)}`);
    await this.publisher.publishEvents([event]);
  }
}
