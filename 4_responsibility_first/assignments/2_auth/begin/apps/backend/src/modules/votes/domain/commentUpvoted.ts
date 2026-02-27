
import { DomainEvent, DomainEventStatus } from '@dddforum/core';
import { EventModel } from '@dddforum/core'

interface CommentUpvotedEventProps {
  commentId: string;
  memberId: string;
}

export class CommentUpvoted extends DomainEvent {
  private constructor(
    props: CommentUpvotedEventProps,
    id?: string,
    retries?: number, 
    status?: DomainEventStatus,
    createdAt?: string
  ) {
    super('CommentUpvoted', props, props.commentId, id, retries, status, createdAt);
  }

  public static create (props: CommentUpvotedEventProps) {
    return new CommentUpvoted(props);
  }

  public static toDomain (eventModel: EventModel): CommentUpvoted {
    const serializedData = JSON.parse(eventModel.data) as CommentUpvotedEventProps

    return new CommentUpvoted(
      {
        commentId: serializedData.commentId,
        memberId: serializedData.memberId
      }, 
      eventModel.id, eventModel.retries, 
      eventModel.status as DomainEventStatus, 
      eventModel.dateCreated.toISOString()
    )
  }
}


// import { DomainEvent } from '@dddforum/core';
// import { randomUUID } from 'crypto';

// export class CommentUpvoted extends DomainEvent {
//   constructor(
//     public readonly commentId: string,
//     public readonly memberId: string,
//     public readonly id: string = randomUUID(),
//     public readonly date: Date = new Date()
//   ) {
//     super(id, date, 'CommentUpvoted');
//   }
// }