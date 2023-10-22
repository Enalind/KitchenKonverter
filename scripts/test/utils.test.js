import {expect, jest, test, describe} from '@jest/globals';
import { decimalToFraction, calculateUnitString } from '../src/utils';
import { decimalToFractionLookup, conversions } from '../src/constants';
import { searchChildrenRecursively, updateMatches } from '../src/content_script';

describe("Utilities", () => {
    test("Decimal to fraction", () => {
        expect(decimalToFraction(0.5, "dl" ,decimalToFractionLookup)).toEqual(["1/2", "dl"])
        expect(decimalToFraction(5, "ml" ,decimalToFractionLookup)).toEqual([5, "mls"])
        expect(decimalToFraction(3.12, "l" ,decimalToFractionLookup)).toEqual(["3 and 1/10", "ls"])
    })
    test("Convert decimal and unit to fraction", () => {
        const unitList = conversions["volume"]["metric"]
        expect(calculateUnitString(50, unitList, decimalToFractionLookup)).toEqual([5, "cls"])
        expect(calculateUnitString(432.12, unitList, decimalToFractionLookup)).toEqual(["4 and 1/3", "dls"])
    })
})