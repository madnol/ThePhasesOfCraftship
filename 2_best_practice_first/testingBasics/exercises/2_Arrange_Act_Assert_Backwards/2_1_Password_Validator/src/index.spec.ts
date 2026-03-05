import { PasswordValidator } from "./index"

describe('password validator', () => {

  it('knows that "Hello5" is between 5 and 15 characters long', () => {
    let output = PasswordValidator.validate("Hello5")
    expect(output.result).toBeTruthy()
    expect(output.errors).toHaveLength(0)
  })

  it('knows that "Pwd1" is NOT between 5 and 15 characters long', () => {
    let output = PasswordValidator.validate("Pwd1")
    expect(output.result).toBeFalsy()
    expect(output.errors).toHaveLength(1)
    expect(output.errors[0].type).toEqual("InvalidLength")
    expect(output.errors[0].message).toEqual("Must be between 5 and 15 characters long")
  })

  it('knows that "thePhysical1234567" is NOT between 5 and 15 characters long', () => {
    let output = PasswordValidator.validate("thePhysical1234567")
    expect(output.result).toBeFalsy()
    expect(output.errors).toHaveLength(1)
    expect(output.errors[0].type).toEqual("InvalidLength")
    expect(output.errors[0].message).toEqual("Must be between 5 and 15 characters long")
  })
})


