import { PasswordValidator } from "./index"

const INVALID_LENGTH = {
  type: "InvalidLength",
  message: "Must be between 5 and 15 characters long"
}

describe('password validator', () => {

  describe('checking between 5 to 15 characters long', () => {
    it.each([
      ["Hello5", true, []],
      ["Pwd1", false, [INVALID_LENGTH]],
      ["thePhysical1234567", false, [INVALID_LENGTH]]
    ])
      ('knows that "%s" should return %s', (input, result, errors) => {
        let output = PasswordValidator.validate(input)

        expect(output.result).toBe(result)
        expect(output.errors).toHaveLength(errors.length)
        if (errors.length) {
          expect(output.errors[0].type).toEqual(errors[0].type)
          expect(output.errors[0].message).toEqual(errors[0].message)
        }
      })
  })

  it('knows "Notapassword1" contains at least one digit', () => {
    let output = PasswordValidator.validate("Notapassword1")

    expect(output.result).toBeTruthy()
    expect(output.errors).toHaveLength(0)
  })

  it('knows "Zetman0" contains at least one digit', () => {
    let output = PasswordValidator.validate("Notapassword1")

    expect(output.result).toBeTruthy()
    expect(output.errors).toHaveLength(0)
  })

  it('knows "maxwellTheBe" does not contains any digit', () => {
    let output = PasswordValidator.validate("maxwellTheBe")

    expect(output.result).toBeFalsy()
    expect(output.errors).toHaveLength(1)
    expect(output.errors[0].type).toEqual("NoDigitIncluded")
    expect(output.errors[0].message).toEqual('Must have at least one digit')
  })


})


