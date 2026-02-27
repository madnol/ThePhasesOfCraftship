import { Users } from "@dddforum/api";
import { makeAutoObservable } from "mobx";

// Unify all props in one interface
interface UserDmProps {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export class UserDm {

  private props: UserDmProps;

  constructor (
    props: UserDmProps
  ) {
    this.props = props;
    makeAutoObservable(this);
  }

  get id () {
    return this.props.id;
  }

  get email () {
    return this.props.email;
  }

  get username () {
    return this.props.username;
  }

  public static fromDTO (dto: Users.DTOs.UserDTO): UserDm {
    return new UserDm({
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
    });
  }
}
