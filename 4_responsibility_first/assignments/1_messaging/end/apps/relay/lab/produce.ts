import { Config } from "@dddforum/config";
import { DomainEvent } from "@dddforum/core";
import { PrismaDatabase } from "@dddforum/database";
import { EventOutboxTable } from "@dddforum/outbox";
import { randomUUID } from "crypto";

class AnotherTestEvent extends DomainEvent {
  constructor (aggregateId: string, data: any) {
    super(aggregateId, data, 'AnotherTestEvent');
  }
}

const config = Config();
const prisma = new PrismaDatabase(config);
const outbox = new EventOutboxTable(prisma);


outbox.save([new AnotherTestEvent(randomUUID(), { data: process.argv[2] })])
.then(() => process.exit())