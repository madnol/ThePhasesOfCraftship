export const palindromeChecker = (value: string) => {

    return value.split("").reverse().join("").toLowerCase() === value.toLocaleLowerCase()
}