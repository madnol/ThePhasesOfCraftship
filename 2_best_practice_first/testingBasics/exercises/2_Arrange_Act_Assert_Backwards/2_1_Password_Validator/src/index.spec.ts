import { PasswordValidator } from "./index"

const INVALID_LENGTH = {
  type: "InvalidLength",
  message: "Must be between 5 and 15 characters long"
}


const NO_DIGIT_INCLUDED = {
  type: "NoDigitIncluded",
  message: "Must have at least one digit"
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

  describe('checking for at least one digit', () => {
    it.each([
      ["Notapassword1", true, []],
      ["Zetman0", true, []],
      ["maxwellTheBe", false, [NO_DIGIT_INCLUDED]]
    ])
      ('knows %s should return %s', (input, result, errors) => {
        let output = PasswordValidator.validate(input)

        expect(output.result).toBe(result)
        expect(output.errors).toHaveLength(errors.length)
        if (errors.length) {
          expect(output.errors[0].type).toEqual(errors[0].type)
          expect(output.errors[0].message).toEqual(errors[0].message)
        }
      })
  })


  it('knows "Without2" contains at least one uppercase character', () => {
    let output = PasswordValidator.validate("Without2")

    expect(output.result).toBeTruthy()
    expect(output.errors).toHaveLength(0)
  })


  it('knows "maxwell1_c" does not contains any uppercase character', () => {
    let output = PasswordValidator.validate("maxwell1_c")

    expect(output.result).toBeFalsy()
    expect(output.errors).toHaveLength(1)
    expect(output.errors[0].type).toEqual("MissingUppercaseCharacter")
    expect(output.errors[0].message).toEqual("Must have at least one upper case letter")
  })
})


