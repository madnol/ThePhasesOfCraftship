
import { ApplicationErrors } from "@dddforum/errors/application";
import { ValueObject } from '@dddforum/core'
import { z } from "zod";

// Note: It's debatable whether you should validate the commands or validate the 
// value objects in the use cases.
// Actually, the most intelligent approach would be to validate within the commands
// and then return a validated command object comprised of pure value objects. 
// UnvalidatedCommand -> ValidatedCommandWithValueObjects -> passed to use case which does not
// need to question whether the value objects are valid or not.
// This keeps the domain model pure. Of course, this approach takes a bit more work but it 
// would be the most safe, accurate approach.

const memberUsernameSchema = z.string().min(5).max(20);

interface MemberUsernameProps {
  value: string;
}

export class MemberUsername extends ValueObject<MemberUsernameProps> {
  private constructor (props: MemberUsernameProps) {
    super(props);
  }

  get value () {
    return this.props.value
  }

  public static toDomain (value: string): MemberUsername {
    return new MemberUsername({ value });
  }

  public static create (input: string | undefined): MemberUsername | ApplicationErrors.ValidationError {

    /**
     * Handle validation rules here. There are many possibilities for types of validation rules
     * we could use here.
     */

    const result = memberUsernameSchema.safeParse(input);

    if (result.success) {
      return new MemberUsername({ value: input as string });
    }

    return new ApplicationErrors.ValidationError(`Member username invalid`);
  }
}
