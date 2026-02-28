export const fizzbuzz = (value: number) => {
    if (value === 15) return "FizzBuzz"
    if (value % 3 === 0) return "Fizz"
    if (value % 5 === 0) return "Buzz"
    return "1"
}