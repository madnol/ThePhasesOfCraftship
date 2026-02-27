

import { DomainEvent } from "@dddforum/core";
import { randomUUID } from "crypto";

export class CommentPosted extends DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly memberId: string,
    public readonly postId: string,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date()
  ) {
    super(id, date, 'CommentPosted');
  }
}
