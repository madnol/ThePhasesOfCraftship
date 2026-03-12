import { statsCalculator } from "."

describe('stats calculator', () => {

    it('return {min: 7, max: 7, elements: 1, average: 7.0} for the sequence [7]', () => {
        expect(statsCalculator([7])).toEqual({ min: 7, max: 7, elements: 1, average: 7.0 })
    })
})