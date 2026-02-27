

import { DomainEvent, DomainEventStatus } from '@dddforum/core';
import { EventModel } from '@dddforum/database'

interface PostCreatedEventProps {
  postId: string;
  memberId: string;
}

export class PostCreated extends DomainEvent {
  private constructor(
    props: PostCreatedEventProps,
    id?: string,
    retries?: number, 
    status?: DomainEventStatus,
    createdAt?: string
  ) {
    super(props.postId, props, 'PostCreated', id, retries, status, createdAt);
    
  }

  public static create (props: PostCreatedEventProps) {
    return new PostCreated(props);
  }

  public static toDomain (eventModel: EventModel): PostCreated {
    const serializedData = JSON.parse(eventModel.data) as PostCreatedEventProps

    // Validate this data here using zod or something

    return new PostCreated(
      {
        postId: serializedData.postId,
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

// export class PostCreated extends DomainEvent {
//   constructor(
//     public readonly postId: string,
//     public readonly memberId: string,
//     public readonly id: string = randomUUID(),
//     public readonly date: Date = new Date()
//   ) {
//     super(id, date, 'PostCreated');
//   }
// }
