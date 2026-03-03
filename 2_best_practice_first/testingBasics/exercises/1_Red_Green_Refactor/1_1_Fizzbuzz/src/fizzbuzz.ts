export const fizzbuzz = (value: number) => {
    if (value < 1 || value > 100) throw new Error("the number should be among 1 and 100")
    const isMultipleOfThree = value % 3 === 0
    const isMultipleOfFive = value % 5 === 0

    if (isMultipleOfThree && isMultipleOfFive) return "FizzBuzz"
    if (isMultipleOfThree) return "Fizz"
    if (isMultipleOfFive) return "Buzz"

    return `${value}`
}