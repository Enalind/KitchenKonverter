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
function setupDOMForSearch(innerHTML){
    document.body.innerHTML = innerHTML
    const globalExpression = /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(cup)(s?[\w\s]{0,10})/gi
    var matchList = []
    searchChildrenRecursively(document.body, null, null, globalExpression, matchList)
    return matchList
}
describe("Main functionality", () => {
    test("Searching children", () => {
        expect(setupDOMForSearch(`<h1>1 cup</h1>`)).toEqual([[document.querySelector("h1"), ["1 cup"]]])
        expect(setupDOMForSearch(`<h1><p>2 cups</p></h1>`)).toEqual([[document.querySelector("p"), ["2 cups"]]])
        expect(setupDOMForSearch(`<h1><p>2 cups milk</p><div>1/3 cups flour</div></h1>`)).toEqual([[document.querySelector("p"), ["2 cups milk"]],[document.querySelector("div"), ["1/3 cups flour"]]])
        expect(setupDOMForSearch(`<div><h1>1</h1><p>cups</p></div>`)).toEqual([[document.querySelector("div"), ["1cups"]]])
    })
    test("Updating children", () => {
        
        document.body.innerHTML = `<h1><p>2 dl milk</p><div>1/3 dl flour</div></h1>`
        let matchList = [[document.querySelector("p"), ["2 dl milk"]],[document.querySelector("div"), ["1/3 dl flour"]]]
        expect(updateMatches(matchList, conversions.volume.regex.metric[1], "volume", {"from": "metric", "to": "us"})).toEqual("<h1><p kitchen-converted=\"true\">3/4 cup milk</p><div kitchen-converted=\"true\">1 and 1/10 fl ozs flour</div></h1>")
        
        document.body.innerHTML = `<div><h1>1</h1><p>cups</p></div>`
        matchList = [[document.querySelector("div"), ["1cups"]]]
        expect(updateMatches(matchList, conversions.volume.regex.us[1], "volume", {"from": "us", "to": "metric"})).toEqual("<div><h1 kitchen-converted=\"true\">2 and 2/5</h1><p kitchen-converted=\"true\">dls</p></div>")

        document.body.innerHTML = `<div><strong>optional: </strong> 1 cup</div>`
        matchList = [[document.querySelector("div"), [" 1 cup"]]]
        expect(updateMatches(matchList)).toEqual("<div kitchen-converted=\"true\"><strong>optional: </strong> 2 and 2/5 dls</div>")

        document.body.innerHTML = `<div> ½ cup</div>`
        matchList = [[document.querySelector("div"), [" ½ cup"]]]
        expect(updateMatches(matchList)).toEqual("<div kitchen-converted=\"true\"> 1 and 1/5 dls</div>")

        document.body.innerHTML = `<div> 1½ cup</div>`
        matchList = [[document.querySelector("div"), [" 1½ cup"]]]
        expect(updateMatches(matchList)).toEqual("<div kitchen-converted=\"true\"> 3 and 1/2 dls</div>")

        document.body.innerHTML = `<div> ½ cup</div>`
        matchList = [[document.querySelector("div"), [" ½ cup"]]]
        expect(updateMatches(matchList)).toEqual("<div kitchen-converted=\"true\"> 1 and 1/5 dls</div>")

        document.body.innerHTML = `<div><div id=\"cheese\">1 cup cheese</div><div id=\"flour\">1 cup flour</div></div>`
        matchList = [[document.querySelector("#cheese"), ["1 cup cheese"]], [document.querySelector("#flour"), ["1 cup flour"]]]
        expect(updateMatches(matchList)).toEqual("<div><div id=\"cheese\" kitchen-converted=\"true\">2 and 2/5 dls cheese</div><div id=\"flour\" kitchen-converted=\"true\">2 and 2/5 dls flour</div></div>")
    })
})