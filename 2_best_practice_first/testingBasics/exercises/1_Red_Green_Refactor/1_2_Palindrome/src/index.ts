export const palindromeChecker = (value: string) => {
    const reverse = value.split("").reverse().join("")
    return reverse.toLowerCase() === value.toLowerCase()
}