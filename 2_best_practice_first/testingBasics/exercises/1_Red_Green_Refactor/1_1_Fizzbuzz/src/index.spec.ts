import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
    it.each([1, 2, 4])('returns "%i" for %i (not a multiple of 3 or 5)', (value) => {
        expect(fizzbuzz(value)).toBe(value.toString())
    })

    it.each([3, 6, 9])('returns "Fizz" for %i', (value) => {
        expect(fizzbuzz(value)).toBe("Fizz")
    })

    it.each([5, 10, 20])('returns "Buzz" for %i', (value) => {
        expect(fizzbuzz(value)).toBe("Buzz")
    })

    it.each([15, 30, 45])('returns "FizzBuzz" for %i', (value) => {
        expect(fizzbuzz(15)).toBe("FizzBuzz")
    })
});
