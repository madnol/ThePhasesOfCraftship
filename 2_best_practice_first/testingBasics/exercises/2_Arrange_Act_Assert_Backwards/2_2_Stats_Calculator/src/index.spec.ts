import { statsCalculator } from "."

describe('stats calculator', () => {

    it('return {min: 7, max: 7, elements: 1, average: 7.0} for the sequence [7]', () => {
        expect(statsCalculator([7])).toEqual({ min: 7, max: 7, elements: 1, average: 7.0 })
    })
    it('return {min: 3, max: 3, elements: 1, average: 3.0} for the sequence [3]', () => {
        expect(statsCalculator([3])).toEqual({ min: 3, max: 3, elements: 1, average: 3.0 })
    })
})