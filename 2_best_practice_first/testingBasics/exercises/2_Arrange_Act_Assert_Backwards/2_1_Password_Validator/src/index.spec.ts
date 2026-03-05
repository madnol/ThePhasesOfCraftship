import { PasswordValidator } from "./index"

describe('password validator', () => {

  it('knows that "Hello5" is between 5 and 15 characters long', () => {
    let output = PasswordValidator.validate("Hello5")
    expect(output.result).toBeTruthy()
    expect(output.errors).toHaveLength(0)
  })
})


