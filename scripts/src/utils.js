import { commonUnicodeFractions, fractionMatcherRegex, singularFractionRegex, slashFractionMatcherRegex, conversions} from "./constants";
export const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )


export function convertToDecimalOfNewUnit(numericPart, measureType, languageInfo, unitPart){
    var isSlashFractionMatched = false
    var convertedQuantity = 0
    if(numericPart.includes("and")){
        convertedQuantity += parseFloat(numericPart)
        numericPart.replace(numericPart + " and ", "")
    }
    //Check if the match is written like so: 1 and 1/2
    if(slashFractionMatcherRegex.test(numericPart)){
        isSlashFractionMatched = true
        const slashFractionMatch = numericPart.match(slashFractionMatcherRegex)
        convertedQuantity += parseFloat(slashFractionMatch[1])
        convertedQuantity += parseFloat(slashFractionMatch[2].split("/")[0]) / parseFloat(slashFractionMatch[2].split("/")[1])
    }
    //Check if the match is written like so: 1 1/2
    else if(numericPart.includes("/")){
        convertedQuantity += parseFloat(numericPart.split("/")[0]) / parseFloat(numericPart.split("/")[1])
    }
    //Check if the match is written like so: 1/2
    else if(fractionMatcherRegex.test(numericPart)){
        const fractionMatch = numericPart.match(fractionMatcherRegex)
        const fractionalQuantity = commonUnicodeFractions[fractionMatch[2]]
        convertedQuantity += parseInt(fractionMatch[1]) + (parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]))
    }
    //Check if the match is written like so: 1½
    else if(singularFractionRegex.test(numericPart)){
        
        const fractionMatch = numericPart.match(singularFractionRegex)
        const fractionalQuantity = commonUnicodeFractions[fractionMatch[0]]
        convertedQuantity += parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1])
    }
    //Check if the match is written like so: ½
    else{
        convertedQuantity += parseFloat(numericPart.replace(",", "."))
    }
    if(!isSlashFractionMatched){numericPart = numericPart.replaceAll(" ", "")}

    if(measureType != "temperature"){
        var unitFound = false
        conversions[measureType][languageInfo.from].forEach(unit => {
            if(unitPart.toLowerCase().replace(" ", "") == unit["name"] | unit.abbr.includes(unitPart.toLowerCase()) && !unitFound){
                unitFound = true
                convertedQuantity = convertedQuantity * unit.standard
            }
        })
        if(!unitFound){console.log("unit not found"); debugger;}
    } 
    return convertedQuantity
}

export function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

export function decimalToFraction(decimalValue, unit, decimalToFractionLookup, addS) {
    if (parseFloat(decimalValue) < 0.1){
        return [decimalValue, unit]
    }
    let fractionalPart = decimalValue % 1;
    const wholePart = parseInt(decimalValue - fractionalPart);
    // Calculate the fractional and whole parts
    if(fractionalPart === 0){
        if(decimalValue > 1 && addS){return [parseInt(decimalValue), unit + "s"]}
        else{return [parseInt(decimalValue), unit]}
    }
    fractionalPart = fractionalPart.toFixed(1);
    fractionalPart = decimalToFractionLookup[fractionalPart];
    // Convert the fractional part to a lookup key (rounded to one decimal place)
    
    if (decimalValue > 1) {
        if (fractionalPart === 0 || fractionalPart === undefined) {
            const unitPart = unit + "s"
            return [wholePart, unitPart]
        }
        const numericPart = wholePart + " and " + fractionalPart
        if(addS){return [numericPart, unit + "s"]}
        return [numericPart, unit];
    }
    // Handle cases when decimalValue is greater than 1
    return [fractionalPart, unit];
    // Handle cases when decimalValue is less than or equal to 1
}
export function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}
export function calculateUnitString(measureValue, unitList, decimalToFractionLookup) {
        sortByKey(unitList, "standard");
        // Sort the unitList by the "standard" property
        for (const unit of unitList) {
            if (measureValue > 0.5 * unit.standard) {
                // Check if the measureValue is greater than half of the unit's standard value
                const measureFraction = (measureValue / unit.standard).toFixed(1);
                const unitAbbreviation = unit.abbr != [] ? unit.abbr[0] : unit.name;
                return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup, false);
            }
        }
    
        const smallestUnit = unitList[unitList.length - 1];
        const measureFraction = (measureValue / smallestUnit.standard).toFixed(4);
        if(smallestUnit.abbr.length > 0){
            return decimalToFraction(measureFraction, smallestUnit.abbr[0], decimalToFractionLookup, true);
        }
        return decimalToFraction(measureFraction, smallestUnit.name, decimalToFractionLookup, false);
        // If none of the units in unitList match, use the smallest unit
}