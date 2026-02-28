import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
    it('returns "1" for 1', () => {
        expect(fizzbuzz(1)).toBe("1")
    })

    it('returns "Fizz" for 3', () => {
        expect(fizzbuzz(3)).toBe("Fizz")
    })
});
