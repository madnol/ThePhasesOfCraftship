
import { DomainEvent } from "@dddforum/core";
import { randomUUID } from "crypto";
import { Types } from '@dddforum/api/members'

export class MemberReputationLevelUpgraded extends DomainEvent {
  constructor (
    public readonly memberId: string,
    public readonly newLevel: Types.ReputationLevel,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date()
    ) {
      super(id, date, 'MemberReputationLevelUpgraded');
    }
}
