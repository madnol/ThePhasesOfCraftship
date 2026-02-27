import { DomainEvent } from "@dddforum/core";
import { EventOutboxTable } from "@dddforum/outbox";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const outbox = new EventOutboxTable(prisma);

class AnotherTestEvent extends DomainEvent {
  constructor (aggregateId: string, data: any) {
    super('AnotherTestEvent', data, aggregateId);
  }
}

outbox.save([new AnotherTestEvent(randomUUID(), { data: process.argv[2] })]);
