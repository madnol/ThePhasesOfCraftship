import { palindromeChecker } from "."



describe('palindrome checker', () => {
    it('returns true for "mom"', () => {
        expect(palindromeChecker("mom")).toBeTruthy()
    })

    it('returns true for "Mom"', () => {
        expect(palindromeChecker("Mom")).toBeTruthy()
    })

    it('returns true for "MoM"', () => {
        expect(palindromeChecker("MoM")).toBeTruthy()
    })

    it('returns false for "Momx"', () => {
        expect(palindromeChecker("Momx")).toBeFalsy()
    })

    it('returns true for "xMomx"', () => {
        expect(palindromeChecker("xMomx")).toBeTruthy()
    })
})