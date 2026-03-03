import { palindromeChecker } from "."



describe('palindrome checker', () => {

    it.each(["mom", "Mom", "MoM", "xMomx", "Was It A Rat I Saw", "Never Odd or Even"])
        ('returns true for "%s"', (value) => {
            expect(palindromeChecker(value)).toBeTruthy()
        })

    it('returns false for "Momx"', () => {
        expect(palindromeChecker("Momx")).toBeFalsy()
    })

    it('returns false for "Never Odd or Even1"', () => {
        expect(palindromeChecker("Never Odd or Even1")).toBeFalsy()
    })
})