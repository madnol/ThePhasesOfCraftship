

import { randomUUID } from "crypto";
import { MemberReputationLevelUpgraded } from "./memberReputationLevelUpgraded";
import { MemberUsername } from "./memberUsername";
import { AggregateRoot, Result, success, fail } from "@dddforum/core";
import { ApplicationErrors } from "@dddforum/errors/application";
import { MemberModel } from '@dddforum/database'
import { Types } from "@dddforum/api/members";
import { Members } from "@dddforum/api";

interface MemberProps {
  id: string;
  userId: string;
  username: MemberUsername;
  reputationScore: number;
  reputationLevel: Types.ReputationLevel
}

interface CreateMemberInput {
  userId: string;
  username: string;
}

export class Member extends AggregateRoot {

  public static REPUTATION_SCORE_THRESH = {
    Level1: 5,
    Level2: 10
  }

  private props: MemberProps;

  private constructor (props: MemberProps) {
    super();
    this.props = props
  }

  get id () {
    return this.props.id;
  }

  get userId () {
    return this.props.userId;
  }

  get reputationScore () {
    return this.props.reputationScore
  }

  get username () {
    return this.props.username;
  }

  get reputationLevel () {
    return this.props.reputationLevel;
  }

  updateReputationScore (newScore: number) {
    const oldScore = this.props.reputationScore;

    console.log('New member score', newScore)
    console.log('Old member score', oldScore)

    if (newScore === oldScore) {
      console.log('No change')
      return;
    }

    this.props.reputationScore = newScore;

    if (oldScore < Member.REPUTATION_SCORE_THRESH.Level2 && newScore >= Member.REPUTATION_SCORE_THRESH.Level2) {
      this.props.reputationLevel = Types.ReputationLevel.Level3;
      console.log('going to level 3!')
      this.domainEvents.push(MemberReputationLevelUpgraded.create({
        memberId: this.id, 
        newRepuationScore: this.reputationScore,
        newLevel: this.reputationLevel
      }));
      return;
    }
    
    if (oldScore < Member.REPUTATION_SCORE_THRESH.Level1 && newScore >= Member.REPUTATION_SCORE_THRESH.Level1) {
      this.props.reputationLevel = Types.ReputationLevel.Level2;
      this.domainEvents.push(MemberReputationLevelUpgraded.create({
        memberId: this.id, 
        newRepuationScore: this.reputationScore,
        newLevel: this.reputationLevel
      }));
      console.log('going to level 2!')
    } 
  }

  public static create (inputProps: CreateMemberInput): Result<Member, ApplicationErrors.ValidationError> {
    const memberUsernameOrError = MemberUsername.create(inputProps.username);

    // Example of using value objects to validate input to create the aggregate
    if (memberUsernameOrError instanceof ApplicationErrors.ValidationError) {
      return fail(memberUsernameOrError)
    }

    return success(new Member({
      ...inputProps,
      id: randomUUID(),
      reputationScore: 0,
      reputationLevel: Types.ReputationLevel.Level1,
      username: memberUsernameOrError
    }));
  }

  public static toDomain (recreationProps: MemberModel | MemberProps): Member {
    return new Member({
      id: recreationProps.id,
      reputationScore: recreationProps.reputationScore,
      userId: recreationProps.userId,
      username: recreationProps.username instanceof MemberUsername ? recreationProps.username : MemberUsername.toDomain(recreationProps.username),
      reputationLevel: recreationProps.reputationLevel as Types.ReputationLevel
    });
  }

  toDTO (): Members.DTOs.MemberDTO {
    return {
      userId: this.props.userId,
      memberId: this.id,
      username: this.props.username.value,
      reputationLevel: this.props.reputationLevel,
      reputationScore: this.props.reputationScore
    }
  }

  toPersistence () {
    return {
      id: this.id,
      userId: this.props.userId,
      username: this.props.username.value,
      reputationScore: this.props.reputationScore,
      reputationLevel: this.props.reputationLevel,
    }
  }

  /**
   * @description Members' voting power (weight) increases when they 
   * get to level 3. Every vote that they cast has a weight of the rounded
   * value of their reputation score / 10.
   */

  public getVoteWeight (): number {
    if (this.reputationLevel === 'Level3') {
      return Math.round(this.reputationScore / 10);
    } else {
      return 1;
    }
  }

}
