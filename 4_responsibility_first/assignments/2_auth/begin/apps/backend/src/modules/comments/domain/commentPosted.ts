

import { DomainEvent, DomainEventStatus } from '@dddforum/core';
import { EventModel } from '@dddforum/core'

interface CommentPostedEventProps {
  commentId: string
  memberId: string
  postId: string
}

export class CommentPosted extends DomainEvent {
  private constructor(
    props: CommentPostedEventProps,
    id?: string,
    retries?: number, 
    status?: DomainEventStatus,
    createdAt?: string
  ) {
    super('CommentPosted', props, props.commentId, id, retries, status, createdAt);
  }

  public static create (props: CommentPostedEventProps) {
    return new CommentPosted(props);
  }

  public static toDomain (eventModel: EventModel): CommentPosted {
    const serializedData = JSON.parse(eventModel.data) as CommentPostedEventProps

    return new CommentPosted(
      {
        commentId: serializedData.commentId,
        memberId: serializedData.memberId,
        postId: serializedData.postId
      }, 
      eventModel.id, eventModel.retries, 
      eventModel.status as DomainEventStatus, 
      eventModel.dateCreated.toISOString()
    )
  }
}

// import { DomainEvent } from "@dddforum/core";
// import { randomUUID } from "crypto";

// export class CommentPosted extends DomainEvent {
//   constructor(
//     public readonly commentId: string,
//     public readonly memberId: string,
//     public readonly postId: string,
//     public readonly id: string = randomUUID(),
//     public readonly date: Date = new Date()
//   ) {
//     super(id, date, 'CommentPosted');
//   }
// }
