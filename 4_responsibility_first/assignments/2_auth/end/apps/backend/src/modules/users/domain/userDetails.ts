
import { DTOs } from "@dddforum/api/users"

export class UserDetails {
  // Temporary
  public static toDTO (model: any): DTOs.UserDTO {
    return {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
    }
  }
}
