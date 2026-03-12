export const statsCalculator = (sequence: number[]) => {
    if (sequence.length === 0) throw new Error("invalidInput")
    const value = sequence[0]

    return { min: value, max: value, elements: 1, average: value }
} 