import { palindromeChecker } from "."



describe('palindrome checker', () => {
    it('returns true for "mom"', () => {
        expect(palindromeChecker("mom")).toBeTruthy()
    })
})