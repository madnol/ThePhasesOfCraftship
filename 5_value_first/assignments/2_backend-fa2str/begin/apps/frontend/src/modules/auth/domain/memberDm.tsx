
import { Members } from '@dddforum/api'
import { DTOs } from '@dddforum/api/members';

interface MemberDmProps {
  id: string;
  username: string;
  email: string;
  userId: string;
  reputationLevel: Members.Types.ReputationLevel;
  reputationScore: number;
}

export class MemberDm {
  private props: MemberDmProps;

  constructor(props: MemberDmProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get userId(): string {
    return this.props.userId;
  }

  get reputationLevel (): Members.Types.ReputationLevel {
    return this.props.reputationLevel
  }

  public static toDomain (memberDTO: DTOs.MemberDTO) {
    return new MemberDm({
      id: memberDTO.memberId,
      username: memberDTO.username,
      userId: memberDTO.userId,
      reputationLevel: memberDTO.reputationLevel,
      reputationScore: memberDTO.reputationScore,
      email: '' // Since email is not in DTO, initialize as empty string
    });
  }

  toDTO() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      userId: this.userId
    };
  }
}