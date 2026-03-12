import { statsCalculator } from "."

describe('stats calculator', () => {

    it.each([
        [[7], { min: 7, max: 7, elements: 1, average: 7.0 }],
        [[3], { min: 3, max: 3, elements: 1, average: 3.0 }],
        [[3, 3], { min: 3, max: 3, elements: 2, average: 3.0 }],
        [[3, 9], { min: 3, max: 9, elements: 2, average: 6.0 }],
        [[-10, -3, -7], { min: -10, max: -3, elements: 3, average: -6.666666666666667 }],
        [[2, 4, 21, -8, 53, 40], { min: -8, max: 53, elements: 6, average: 18.666666666666668 }],
    ])('for the sequence %s returns %s', (sequence, output) => {
        expect(statsCalculator(sequence)).toEqual(output)
    })

    it('report an error when the sequence is []', () => {
        expect(() => statsCalculator([])).toThrow("invalidInput")
    })
})