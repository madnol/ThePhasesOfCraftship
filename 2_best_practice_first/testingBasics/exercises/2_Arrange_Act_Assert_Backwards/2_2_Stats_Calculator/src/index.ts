export const statsCalculator = (sequence: number[]) => {
    if (sequence.length === 0) throw new Error("invalidInput")
    let min: number = sequence[0];
    let max: number = sequence[0];
    let total: number = sequence[0];
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] < min) {
            min = sequence[i]
        }
        if (sequence[i] > max) {
            max = sequence[i]
        }
        total += sequence[i]
    }

    return { min, max, elements: sequence.length, average: total / sequence.length }
} 