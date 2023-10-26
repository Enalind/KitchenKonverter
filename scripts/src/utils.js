export const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )
export function decimalToFraction(decimalValue, unit, decimalToFractionLookup, addS) {
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
                const unitAbbreviation = unit.abbr ? unit.abbr[0] : unit.name;
                return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup, false);
            }
        }
    
        const smallestUnit = unitList[unitList.length - 1];
        const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
        if(smallestUnit.abbr.length > 0){
            return decimalToFraction(measureFraction, smallestUnit.abbr[0], decimalToFractionLookup, true);
        }
        return decimalToFraction(measureFraction, smallestUnit.name, decimalToFractionLookup, false);
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

export function generateRegexes(){
    var usVolumeList = []
    var metricVolumeList = []
    for(const quantity of Object.keys(conversions)){
        if(quantity != "volume"){continue;}
        for(const language of Object.keys(conversions[quantity])){
            for(const unit of Object.keys(conversions[quantity][language])){
                if(language == "us"){
                    usVolumeList = usVolumeList.concat([conversions[quantity][language][unit]["name"]].concat(conversions[quantity][language][unit]["abbr"]))
                }
                else if(language == "metric"){
                    metricVolumeList = metricVolumeList.concat([conversions[quantity][language][unit]["name"]].concat(conversions[quantity][language][unit]["abbr"]))
                }
                else if(language == "shared"){
                    metricVolumeList = metricVolumeList.concat([conversions[quantity][language][unit]["name"]].concat(conversions[quantity][language][unit]["abbr"]))
                    usVolumeList = usVolumeList.concat([conversions[quantity][language][unit]["name"]].concat(conversions[quantity][language][unit]["abbr"]))
                }
            }
        }
    }
    var usVolumeRegex = "/(\\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\\sand\\s)*(?:[0-9/]*)\\s*("
    metricVolumeList.forEach(volume => {
        usVolumeRegex = usVolumeRegex + "|" + volume
    })
    usVolumeRegex = usVolumeRegex + ")(s?[^\\n]{0,10})/gi"
    var metricVolumeRegex = "/(\\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\\sand\\s)*(?:[0-9/]*)\\s*("
    metricVolumeList.forEach(volume => {
        metricVolumeRegex = metricVolumeRegex + "|" + volume
    })
    metricVolumeRegex = metricVolumeRegex + ")(s?[^\\n]{0,10})/gi"
    console.log(usVolumeRegex, metricVolumeRegex)
}