export const statsCalculator = (sequence: number[]) => {
    const value = sequence[0]

    return { min: value, max: value, elements: 1, average: value }
} 