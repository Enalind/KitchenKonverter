import { decimalToFraction, calculateUnitString } from '../src/utils';
import { decimalToFractionLookup, conversions } from '../src/constants';
import { searchForSplitNodes, updateMatches } from '../src/content_script';
import {expect, jest, test, describe} from '@jest/globals';
function replacementWrapper(matchList, language, measureType){
    var languageDict = {}
    if(language == "metric"){
        languageDict["from"] = "metric"
        languageDict["to"] = "us"
    }
    else{
        languageDict["from"] = "us"
        languageDict["to"] = "metric"
    }
    
    return updateMatches(matchList, conversions[measureType]["regex"][language][1], measureType, languageDict)
}

describe("Replacing US measurments",() => {
    
    test("Single element",() => {
        document.body.innerHTML = `<div>1 cup</div>`
        let matchList = [[document.querySelector("div"), ["1 cup"]]]
        let result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>2 and 2/5 dl</div>")

        document.body.innerHTML = `<div>1.5 oz</div>`
        matchList = [[document.querySelector("div"), ["1.5 oz"]]]
        result = replacementWrapper(matchList, "us", "weight")
        expect(result).toEqual("<div>42 g</div>")

        document.body.innerHTML = `<div>1,5 qt.</div>`
        matchList = [[document.querySelector("div"), ["1,5 qt."]]]
        result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>1 and 2/5 l</div>")
    })

    test("Unicode fractions", () => {
        document.body.innerHTML = `<div>½ fl oz</div>`
        let matchList = [[document.querySelector("div"), ["½ fl oz"]]]
        let result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>1 tbsp</div>")

        document.body.innerHTML = `<div>1½ cup</div>`
        matchList = [[document.querySelector("div"), ["1½ cup"]]]
        result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>3 and 3/5 dl</div>")
    })

    test("Slash fractions", () => {
        document.body.innerHTML = `<div>1/2 fl oz</div>`
        let matchList = [[document.querySelector("div"), ["1/2 fl oz"]]]
        let result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>1 tbsp</div>")

        document.body.innerHTML = `<div>1 and 1/2 cup</div>`
        matchList = [[document.querySelector("div"), ["1 and 1/2 cup"]]]
        result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>3 and 3/5 dl</div>")
    })

    test("Split element", () => {
        document.body.innerHTML = `<div><p>1 </p><h1>cup</h1></div>`
        let matchList = [[document.querySelector("div"), ["1 cup"]]]
        let result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div><p>2 and 2/5  </p><h1>dl</h1></div>")
    })

    test("Deeper node", () => {
        document.body.innerHTML = `<div><b>optional: </b>1 pound</div>`
        let matchList = [[document.querySelector("div"), ["1 pound"]]]
        let result = replacementWrapper(matchList, "us", "weight")
        expect(result).toEqual("<div><b>optional: </b>453 g</div>")
    })

    test("Temperature",() => {
        document.body.innerHTML = `<div>100.1 F</div>`
        let matchList = [[document.querySelector("div"), ["100.1 F"]]]
        let result = replacementWrapper(matchList, "us", "temperature")
        expect(result).toEqual("<div>37 celsius</div>")

        document.body.innerHTML = `<div>200,5 farenheit</div>`
        matchList = [[document.querySelector("div"), ["200,5 farenheit"]]]
        result = replacementWrapper(matchList, "us", "temperature")
        expect(result).toEqual("<div>93 celsius</div>")
    })

    test("Overmatching", () => {
        document.body.innerHTML = `<div>15 Cupertino Heights</div>`
        let matchList = [[document.querySelector("div"), ["15 Cupertino Heights"]]]
        let result = replacementWrapper(matchList, "us", "volume")
        expect(result).toEqual("<div>15 Cupertino Heights</div>")

        document.body.innerHTML = `<div>15 foreign countries</div>`
        matchList = [[document.querySelector("div"), ["15 foreign countries"]]]
        result = replacementWrapper(matchList, "us", "temperature")
        expect(result).toEqual("<div>15 foreign countries</div>")
    })
})

describe("Replacing metric measurments",() => {
    
    test("Single element",() => {
        document.body.innerHTML = `<div>1 dl</div>`
        let matchList = [[document.querySelector("div"), ["1 dl"]]]
        let result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div>3 and 1/3 fl oz</div>")
    })

    test("Unicode fractions", () => {
        document.body.innerHTML = `<div>½ liter</div>`
        let matchList = [[document.querySelector("div"), ["½ liter"]]]
        let result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div>1/2 qt.</div>")
    })

    test("Slash fractions", () => {
        document.body.innerHTML = `<div>1/2 l</div>`
        let matchList = [[document.querySelector("div"), ["1/2 l"]]]
        let result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div>1/2 qt.</div>")

        document.body.innerHTML = `<div>1 and 1/2 milliliter</div>`
        matchList = [[document.querySelector("div"), ["1 and 1/2 milliliter"]]]
        result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div>3 and 1/3 tsps</div>")
    })

    test("Split element", () => {
        document.body.innerHTML = `<div><p>1 </p><h1>cl</h1></div>`
        let matchList = [[document.querySelector("div"), ["1 cl"]]]
        let result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div><p>2/3  </p><h1>tbsp</h1></div>")
    })

    test("Deeper node", () => {
        document.body.innerHTML = `<div><b>optional: </b>1 gram</div>`
        let matchList = [[document.querySelector("div"), ["1 gram"]]]
        let result = replacementWrapper(matchList, "metric", "weight")
        expect(result).toEqual("<div><b>optional: </b>28 ozs</div>")
    })

    test("Temperature",() => {
        document.body.innerHTML = `<div>100 C</div>`
        let matchList = [[document.querySelector("div"), ["100 C"]]]
        let result = replacementWrapper(matchList, "metric", "temperature")
        expect(result).toEqual("<div>212 farenheit</div>")

        document.body.innerHTML = `<div>200 celsius</div>`
        matchList = [[document.querySelector("div"), ["200 celsius"]]]
        result = replacementWrapper(matchList, "metric", "temperature")
        expect(result).toEqual("<div>392 farenheit</div>")
    })

    test("Overmatching", () => {
        document.body.innerHTML = `<div>15 little sheep</div>`
        let matchList = [[document.querySelector("div"), ["15 little sheep"]]]
        let result = replacementWrapper(matchList, "metric", "volume")
        expect(result).toEqual("<div>15 little sheep</div>")

        document.body.innerHTML = `<div>15 Canadian Geese</div>`
        matchList = [[document.querySelector("div"), ["15 Canadian Geese"]]]
        result = replacementWrapper(matchList, "metric", "temperature")
        expect(result).toEqual("<div>15 Canadian Geese</div>")

        document.body.innerHTML = `<div>15 cloaks</div>`
        matchList = [[document.querySelector("div"), ["15 cloaks"]]]
        result = replacementWrapper(matchList, "metric", "temperature")
        expect(result).toEqual("<div>15 cloaks</div>")
    })
})