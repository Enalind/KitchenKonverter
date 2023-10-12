
export function decimalToFraction(decimalValue, unit, decimalToFractionLookup) {
    // Calculate the fractional and whole parts
    
    let fractionalPart = decimalValue % 1;
    const wholePart = parseInt(decimalValue - fractionalPart);

    // Convert the fractional part to a lookup key (rounded to one decimal place)
    fractionalPart = fractionalPart.toFixed(1);
    fractionalPart = decimalToFractionLookup[fractionalPart];
    // Handle special cases when decimalValue is 1
    if (decimalValue === 1) {
        return "1 " + unit;
    }

    // Handle cases when decimalValue is greater than 1
    if (decimalValue > 1) {
        if (fractionalPart === 0 || fractionalPart === undefined) {
            const unitPart = unit + "s"
            return [wholePart, unitPart]
        }
        const numericPart = wholePart + " and " + fractionalPart
        const unitPart = unit + "s"
        return [numericPart, unitPart];
    }

    // Handle cases when decimalValue is less than 1
    return [fractionalPart, unit];
}
export function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}
export function calculateUnitString(measureValue, unitList, decimalToFractionLookup) {
        // Sort the unitList by the "standard" property
        console.log(unitList)
        sortByKey(unitList, "standard");
    
        for (const unit of unitList) {
            // Check if the measureValue is greater than half of the unit's standard value
            if (measureValue > 0.5 * unit.standard) {
                const measureFraction = (measureValue / unit.standard).toFixed(1);
                const unitAbbreviation = unit.abbr[0];
                return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup);
            }
        }
    
        // If none of the units in unitList match, use the smallest unit
        const smallestUnit = unitList[unitList.length - 1];
        const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
        const unitAbbreviation = smallestUnit.abbr[0];
        return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup);
}
export function checkForMissingItems(node, matches, expression, matchList){
    let concatMatchList = []
    matchList.forEach(element => concatMatchList.push(...element[1]))
    let crossReferencedMatchList = []
    matches?.forEach(element => {
        if(concatMatchList.map(ele => ele.trim() == element.trim()).every(v => v === false) && !concatMatchList.join("").includes(element)){
            crossReferencedMatchList.push(element)
        }
    })
    return crossReferencedMatchList
}