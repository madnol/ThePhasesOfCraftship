import { PasswordValidator } from "./index"

const INVALID_LENGTH = {
  type: "InvalidLength",
  message: "Must be between 5 and 15 characters long"
}

const NO_DIGIT_INCLUDED = {
  type: "NoDigitIncluded",
  message: "Must have at least one digit"
}

const MISSING_UPPERCASE_CHARACTER = {
  type: "MissingUppercaseCharacter",
  message: "Must have at least one upper case letter",
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

  describe("checking for at least one uppercase character", () => {
    it.each([
      ["Without2", true, []],
      ["maxwell1_c", false, [MISSING_UPPERCASE_CHARACTER]],
      ["nfnadji3", false, [MISSING_UPPERCASE_CHARACTER]],
    ])
      ("knows %s should return %s", (input, result, errors) => {
        let output = PasswordValidator.validate(input)

        expect(output.result).toBe(result)
        expect(output.errors).toHaveLength(errors.length)
        if (errors.length) {
          expect(output.errors[0].type).toEqual(errors[0].type)
          expect(output.errors[0].message).toEqual(errors[0].message)
        }
      })
  })

})


