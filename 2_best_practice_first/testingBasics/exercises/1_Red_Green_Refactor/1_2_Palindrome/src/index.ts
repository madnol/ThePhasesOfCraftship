export const palindromeChecker = (value: string) => {
    const reverse = value.split("").reverse().join("")
    return reverse.split(" ").join("").toLowerCase() === value.split(" ").join("").toLowerCase()
}