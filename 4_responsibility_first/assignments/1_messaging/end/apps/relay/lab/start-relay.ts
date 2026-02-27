
import { randomUUID } from "crypto";
import { Relay } from "../src/relay";
import { PubSubEventBus } from "@dddforum/bus";
import { EventOutboxTable } from "@dddforum/outbox";
import { DomainEvent, DomainEventStatus } from "@dddforum/core";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";

export class TestEvent extends DomainEvent {
    constructor (aggregateId: string, data: any, id?: string, retries?: number, status?: DomainEventStatus) {
      super(aggregateId, data, 'TestEvent', id, retries, status);
    }
  }

let config = Config();
let database = new PrismaDatabase(config);
let outbox = new EventOutboxTable(database);
let natsEventBus = new PubSubEventBus();
let relay = new Relay(outbox, natsEventBus);

async function setupLab () {
  let unprocessedEvents = [
    new TestEvent(randomUUID(), { testData: 'John' }, randomUUID()),
    new TestEvent(randomUUID(), { testData: 'John' }, randomUUID())
  ]

  let publishedEvents = [
    new TestEvent(randomUUID(), { testData: 'John' }, randomUUID(), 3, 'PUBLISHED')
  ]

  // clear the outbox entirely first
  await database.getConnection().event.deleteMany();
  await outbox.save(unprocessedEvents);
  await outbox.save(publishedEvents);

  return { unprocessedEvents, publishedEvents }
}

async function main () {
  await setupLab();
  relay.start();
}

main ();
