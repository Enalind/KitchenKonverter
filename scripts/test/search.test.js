import {expect, jest, test, describe} from '@jest/globals';
import { decimalToFraction, calculateUnitString } from '../src/utils';
import { decimalToFractionLookup, conversions } from '../src/constants';
import { searchChildrenRecursively, updateMatches } from '../src/content_script';


function setupDOMForSearch(innerHTML, language, measureType){
    document.body.innerHTML = innerHTML
    const globalExpression = conversions[measureType]["regex"][language][0]
    const nonGlobalExpression = conversions[measureType]["regex"][language][1]
    var matchList = []
    searchChildrenRecursively(document.body, null, null, globalExpression, nonGlobalExpression, matchList)
    return matchList
}
describe("Searching US", () => {
    test("Contained within separate nodes", () => {
        expect(setupDOMForSearch(`<h1>1 cup</h1>`, "us", "volume")).toEqual([[document.querySelector("h1"), ["1 cup"]]])
        expect(setupDOMForSearch(`<h1><p>2 gallons</p></h1>`, "us", "volume")).toEqual([[document.querySelector("p"), ["2 gallons"]]])
        expect(setupDOMForSearch(`<h1><p>2 fl oz. milk</p><div>1/3 cups flour</div></h1>`, "us", "volume")).toEqual([[document.querySelector("p"), ["2 fl oz. milk"]],[document.querySelector("div"), ["1/3 cups flour"]]])
        
    })
    test("Contained within multiple nodes", () => {
        expect(setupDOMForSearch(`<div><h1>1</h1><p>fl oz</p></div>`, "us", "volume")).toEqual([[document.querySelector("div"), ["1fl oz"]]])
    })
    test("Floating point strings with comma and dot", () => {
        expect(setupDOMForSearch(`<h1>1.5 cup</h1>`, "us", "volume")).toEqual([[document.querySelector("h1"), ["1.5 cup"]]])
        expect(setupDOMForSearch(`<h1>1,5 cup</h1>`, "us", "volume")).toEqual([[document.querySelector("h1"), ["1,5 cup"]]])
    })
})