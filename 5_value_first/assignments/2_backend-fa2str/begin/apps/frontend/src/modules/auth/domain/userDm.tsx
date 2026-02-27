
import { User, UserCredential } from "firebase/auth";
import { makeAutoObservable } from "mobx";

// Unify all props in one interface
interface UserDmProps {
  id: string;
  email: string;
  idToken: string;
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

  get idToken () {
    return this.props.idToken;
  }

  public static fromFirebase (credentials: UserCredential | User, idToken: string) {
    const user = 'user' in credentials ? credentials.user : credentials;

    const props: UserDmProps = {
      id: user.uid ?? "",
      email: user.email ?? "",
      firstName: user.displayName ? user.displayName.split(' ')[0] : undefined,
      lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : undefined,
      idToken
    }
    
    return new UserDm(props)
  }
}
