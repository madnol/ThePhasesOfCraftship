import { palindromeChecker } from "."



describe('palindrome checker', () => {
    it('returns true for "mom"', () => {
        expect(palindromeChecker("mom")).toBeTruthy()
    })

    it('returns true for "Mom"', () => {
        expect(palindromeChecker("Mom")).toBeTruthy()
    })
})