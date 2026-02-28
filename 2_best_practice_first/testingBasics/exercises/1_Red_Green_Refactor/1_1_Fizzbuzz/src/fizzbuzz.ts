export const fizzbuzz = (value: number) => {
    const isMultipleOfThree = value % 3 === 0
    const isMultipleOfFive = value % 5 === 0

    if (isMultipleOfThree && isMultipleOfFive) return "FizzBuzz"
    if (isMultipleOfThree) return "Fizz"
    if (isMultipleOfFive) return "Buzz"

    return `${value}`
}