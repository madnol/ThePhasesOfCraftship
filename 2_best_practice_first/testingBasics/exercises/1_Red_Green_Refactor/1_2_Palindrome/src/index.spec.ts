import { palindromeChecker } from "."



describe('palindrome checker', () => {

    it.each(["mom", "Mom", "MoM", "xMomx", "Was It A Rat I Saw"])
        ('returns true for "%s"', (value) => {
            expect(palindromeChecker(value)).toBeTruthy()
        })

    it('returns false for "Momx"', () => {
        expect(palindromeChecker("Momx")).toBeFalsy()
    })
})