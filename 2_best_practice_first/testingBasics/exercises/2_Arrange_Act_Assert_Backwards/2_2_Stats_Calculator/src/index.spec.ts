import { statsCalculator } from "."

describe('stats calculator', () => {

    it.each([
        { sequence: [7], output: { min: 7, max: 7, elements: 1, average: 7.0 } },
        { sequence: [3], output: { min: 3, max: 3, elements: 1, average: 3.0 } },
        { sequence: [0], output: { min: 0, max: 0, elements: 1, average: 0.0 } },
        { sequence: [3, 3], output: { min: 3, max: 3, elements: 2, average: 3.0 } },
        { sequence: [3, 9], output: { min: 3, max: 9, elements: 2, average: 6.0 } },
        { sequence: [-5, 5, -3, 3], output: { min: -5, max: 5, elements: 4, average: 0.0 } },
        { sequence: [-10, -3, -7], output: { min: -10, max: -3, elements: 3, average: -6.666666666666667 } },
        { sequence: [2, 4, 21, -8, 53, 40], output: { min: -8, max: 53, elements: 6, average: 18.666666666666668 } },
    ])('for the sequence %sequence returns %output', ({ sequence, output }) => {
        expect(statsCalculator(sequence)).toEqual(output)
    })

    it('report an error when the sequence is []', () => {
        expect(() => statsCalculator([])).toThrow("invalidInput")
    })
})