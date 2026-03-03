import { palindromeChecker } from "."



describe('palindrome checker', () => {

    it.each(["mom", "Mom", "MoM", "xMomx"])('returns true for "%s"', (value) => {
        expect(palindromeChecker(value)).toBeTruthy()
    })

    it('returns false for "Momx"', () => {
        expect(palindromeChecker("Momx")).toBeFalsy()
    })
})