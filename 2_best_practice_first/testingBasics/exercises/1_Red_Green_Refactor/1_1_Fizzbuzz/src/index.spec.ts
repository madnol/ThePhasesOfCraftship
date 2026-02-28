import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
    it('returns "1" for 1', () => {
        expect(fizzbuzz(1)).toBe("1")
    })

    it('returns "Fizz" for 3', () => {
        expect(fizzbuzz(3)).toBe("Fizz")
    })

    it('returns "Buzz" for 5', () => {
        expect(fizzbuzz(5)).toBe("Buzz")
    })

    it('returns "FizzBuzz" for 15', () => {
        expect(fizzbuzz(15)).toBe("FizzBuzz")
    })

    it('returns "Fizz" for 6', () => {
        expect(fizzbuzz(6)).toBe("Fizz")
    })
});
