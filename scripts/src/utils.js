
export function decimalToFraction(decimalValue, unit, decimalToFractionLookup) {
    let fractionalPart = decimalValue % 1;
    const wholePart = parseInt(decimalValue - fractionalPart);
    // Calculate the fractional and whole parts
    if(fractionalPart === 0){
        if(decimalValue > 1){return [parseInt(decimalValue), unit + "s"]}
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
        const unitPart = unit + "s"
        return [numericPart, unitPart];
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
                const unitAbbreviation = unit.abbr[0];
                return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup);
            }
        }
    
        const smallestUnit = unitList[unitList.length - 1];
        const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
        const unitAbbreviation = smallestUnit.abbr[0];
        return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup);
        // If none of the units in unitList match, use the smallest unit
}
export function checkForMissingItems(matches, matchList){
    let concatMatchList = []
    matchList.forEach(element => concatMatchList.push(...element[1]))
    //Pile all matches onto a list of strings
    let crossReferencedMatchList = []
    matches?.forEach(element => {
        if(concatMatchList.map(ele => ele.trim() == element.trim()).every(v => v === false) && !concatMatchList.join("").includes(element)){
            crossReferencedMatchList.push(element)
        }
    })
    //Check if all matches are accounted for, if not add them to the returned matchList
    return crossReferencedMatchList
}