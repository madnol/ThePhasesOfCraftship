import {
  connect,
  NatsConnection,
  StringCodec,
  JetStreamClient,
  JetStreamManager,
  consumerOpts,
  JSONCodec,
  AckPolicy,
  createInbox,
} from "nats";
import { DomainEvent } from "@dddforum/core";
import { EventBus } from "../ports/eventBus";

export class NatsEventBus implements EventBus {
  private nc!: NatsConnection;
  private js!: JetStreamClient;
  private jsm!: JetStreamManager;
  private sc = StringCodec();
  private jc = JSONCodec();
  private isInitialized = false;
  private subscriptions: Map<string, any> = new Map();

  constructor() {}

  public async initialize(): Promise<void> {
    try {
      this.nc = await connect({ servers: "nats://localhost:4222" });
      this.js = this.nc.jetstream();
      this.jsm = await this.nc.jetstreamManager();

      console.log("✅ NATS JetStream connected");

      // Ensure stream exists
      try {
        await this.jsm.streams.add({
          name: "events",
          subjects: ["post.*", "comment.*", "member.*"]
        });
        console.log("✅ JetStream stream 'events' created with subjects: post.*, comment.*, member.*");
      } catch (err: any) {
        if (err.message?.includes("stream name already in use")) {
          console.log("ℹ️ Stream 'events' already exists");
        } else {
          throw err;
        }
      }

      this.isInitialized = true;
    } catch (err) {
      console.error("❌ Failed to initialize NATS connection:", err);
      throw err;
    }
  }

  public async stop(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized || !this.js) {
      throw new Error("NATS JetStream client not initialized. Call initialize() first.");
    }
  }

  private mapEventNameToSubject(eventName: string): string {
    const mapping: Record<string, string> = {
      PostCreated: "post.created",
      PostUpvoted: "post.upvoted",
      PostDownvoted: "post.downvoted",
      CommentPosted: "comment.posted",
      CommentUpvoted: "comment.upvoted",
      CommentDownvoted: "comment.downvoted",
      MemberReputationLevelUpgraded: "member.reputationLevelUpgraded",
      TestEvent: "test.event"
    };
    const subject = mapping[eventName] || eventName.toLowerCase();
    console.log(`🔍 Mapped event name '${eventName}' to subject '${subject}'`);
    return subject;
  }

  public async publishEvents(events: DomainEvent[]): Promise<void> {
    this.ensureInitialized();
    for (const event of events) {
      const subject = this.mapEventNameToSubject(event.name);
      console.log(`📤 Publishing event '${event.name}' to subject '${subject}' with data:`, event);
      try {
        await this.js.publish(subject, this.sc.encode(JSON.stringify(event)));
        console.log(`✅ Successfully published event '${event.name}' to subject '${subject}'`);
      } catch (err) {
        console.error(`❌ Failed to publish event '${event.name}' to subject '${subject}':`, err);
        throw err;
      }
    }
  }

  public async subscribe<T extends DomainEvent>(
    eventTypeName: string,
    handler: (event: T) => Promise<void>,
    options?: { durableName?: string }
  ): Promise<void> {
    this.ensureInitialized();
  
    const durable = (options?.durableName || `default-${eventTypeName}`).replace(/\./g, '-');
    const subject = this.mapEventNameToSubject(eventTypeName);
  
    console.log(`📥 Subscribing to subject '${subject}' with durable '${durable}'`);

    const inbox = createInbox();
  
    const sub = await this.js.subscribe(subject, {
      stream: "events",
      config: {
        durable_name: durable,
        deliver_subject: inbox,
        ack_policy: AckPolicy.Explicit
      }
    });
  
    (async () => {
      for await (const msg of sub) {
        try {
          const decoded = this.jc.decode(msg.data) as T;
          await handler(decoded);
          msg.ack();
          console.log(`✅ Handled '${eventTypeName}' from '${subject}'`);
        } catch (err) {
          console.error(`❌ Failed to handle '${eventTypeName}'`, err);
          msg.term();
        }
      }
    })();
  }

  unsubscribe(eventTypeName: string, handler: (event: DomainEvent) => void): void {
    const sub = this.subscriptions.get(eventTypeName);
    if (sub) {
      sub.drain();
      this.subscriptions.delete(eventTypeName);
    }
  }
}
