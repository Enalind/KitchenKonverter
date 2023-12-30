
import { calculateUnitString, getStorageData, convertToDecimalOfNewUnit, insert } from "./utils";
import { decimalToFractionLookup, defaultConfig, conversions} from "./constants";

export function BeginSearch(expression){
    var matches = [...document.body.textContent.matchAll(expression)]
    // Begin by matching the entire document to the regex
    var matchList = []
    var prevSearchPhrases = []
    for (const match of matches){
        if(prevSearchPhrases.includes(match[0])){continue;}
        // Iterate through the matches, making sure to not search a match word more than once
        // That is beacause the search function returns all the matches in the entire document for a search string
        let simpleMatches = SimpleSearch(match[0])
        for(const simpleMatch of simpleMatches){
            if (!["SCRIPT", "NOSCRIPT", "STYLE"].includes(simpleMatch.tagName)){
                matchList.push([simpleMatch, match[0]])
            }
            //Make sure the nodes are not blacklisted
        }
        prevSearchPhrases.push(match[0])
        // Add the searhed phrase to the blacklist
    }
    var duplicatesToAdd = []
    for(const match of matchList){
        const roof = match[0].textContent.split(match[1]).length - 2
        for (var i = 0; i < roof; i++){
            duplicatesToAdd.push(match)
        }
    }
    // If a singular element contains more than one match of the same word, the duplicate will not be added by the search function
    // This function ensures that these duplicates are added back
    return [...matchList, ...duplicatesToAdd].sort((a, b) => b[1].length - a[1].length)
    // Concatenate the lists and sort them by decending length of the matched string
    // This is neccessary since longer strings like "1 and 1/2 cup" will get two matches
    // One of the full string and one of "1/2 cup" which would present an issue since the shorter string is not displaying the correct measurment
    // If it is placed later in the matchList Iít will be ignored because of how the replacement is structured, ensuring the correct measurment is displayed
}


export function SimpleSearch(text){
    // This function returns all the lowest nodes in the DOM that contains a given search string
    var elements = document.body.getElementsByTagName("*")
    // Initialize all the elements to search, which is always all of them, returned in preorder traversal of the DOM tree
    var latestMatch = null;
    var matchList = []
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent && elements[i].textContent.includes(text) && !elements[i].textContent.includes("/" + text)) {
            if(latestMatch != null && elements[i].parentNode != latestMatch){
                matchList.push(latestMatch)
            }
            latestMatch = elements[i]
        }
    }
    // This loop iterates through the elements and keeps track of the latest element matched
    // Since if the child contains the given string, so will the parent and the elements are searched in preorder the latest match will be a parent of the child
    // Therefore the parent is not the lowest node
    // If the next node searched is not a child to the latestMatch, then that match was one of the lowest nodes containing the given search string, therefore it is added to the list
    matchList.push(latestMatch)
    // The last lowest node matching the string should also be added
    return matchList
}

export function SimpleReplace(matchList, measureType, nonGlobalRegex, languageInfo){
    for(const [node, matchString] of matchList){
        let match = matchString.match(nonGlobalRegex)
        // Iterate through each node-matchString pair and split the matchString into the neccessary groups with the match function
        // It is important to utilize a non global regex, that is because the global flag makes the regex carry the lastIndex from which the regex stopped searching
        // That is unfortunate when the same regex is used many times on different strings
        if(!match[2]){continue;}
        // If no match is found, skip the loop iteration
        let unitNode = node
        let numericPart = match[1]
        const unitPart = match[3]
        // initialize the variable names which are convinient and make the code more readable
        var nodesBeingSearched = [...node.childNodes]

        var nodesToSearch = []
        var i = 0 
        foundNode:
        while (i < 10){
            for(const child of nodesBeingSearched){
                if (child.nodeType == 3){
                    if(child.textContent?.includes(unitPart)){
                        unitNode = child
                        break foundNode
                    }
                }
                if (child.nodeType == 1){
                    nodesToSearch.push(...child.childNodes)
                }
            }
            nodesBeingSearched = nodesToSearch
            nodesToSearch = []
            i++
        }
        
        // Iterate through all the text nodes below the searched node and find the one containing the unit, which is the same one that the alteration will later be inserted into
        // Using the text instead of the textContent key ensures that the rest of the nodes HTML stays intact
        let convertedQuantity = convertToDecimalOfNewUnit(numericPart, measureType, languageInfo, unitPart)
        if(isNaN(convertedQuantity)){continue;}
        // Get the quantity of the match in SI units
        var numericString
        var unitString
        
        if(measureType === "temperature"){
            numericString = parseInt(conversions[measureType][languageInfo.to][0]["conversionFunction"](convertedQuantity))
            unitString = conversions[measureType][languageInfo.to][0]["abbr"][0]
            // If the match is of temperature, then the first abbreviation should be used
            // Also a specialized conversion function is used
        }
        else{
            const unitList = conversions[measureType].shared ? conversions[measureType][languageInfo.to].concat(conversions[measureType].shared) : conversions[measureType][languageInfo.to]
            // Compile a unit list, this is neccessary since the measureType VOLUME has shared measurements like teaspoon and tablespoon, while the other measureTypes do not
            const result = calculateUnitString(convertedQuantity, unitList, decimalToFractionLookup);
            // Take the SI unit and change to the correct result, which is an array comprised of the numeric part and unit part
            numericString = result[0]
            unitString = result[1]
        }
        var windowStart = 0
        var iterations = 0
        while (iterations < 3){
            if (unitNode.textContent.slice(windowStart).indexOf(numericPart + unitPart) === -1){
                // If the numeric and unit parts do not exist in the nodes textContent
                if (windowStart === 0){
                    windowStart = unitNode.textContent.indexOf(unitPart) + unitPart.length
                    // If this is the first iteration get the index of the unit, which is neccessarily in the text node since that is the reason it was chosen earlier
                    // The indexOf returns the start of the unit, but we are interested in the end which is why an offset is added to account for that
                }
                else if(unitNode.textContent.slice(windowStart).indexOf(unitPart) == -1){
                    break
                }
                // If the unit does not exist in the current search window, end the search
                else{
                    windowStart = unitNode.textContent.slice(windowStart).indexOf(unitPart) + unitPart.length + windowStart
                    // Else update the window start to the, the offsets are to account for the length of the unitPart and that the indexOf is only
                    // Given the window, and we are interested in the entire text
                }
            }
            else if (windowStart === 0){
                windowStart = unitNode.textContent.indexOf(numericPart + unitPart) + unitPart.length + numericPart.length
            }
            else{
                windowStart = unitNode.textContent.slice(windowStart).indexOf(numericPart + unitPart) + unitPart.length + windowStart + numericPart.length
            }
            // If the numeric and unit parts do exist in the window, update the windowStart to their match
            if (/[s.,\s/\(\)]|(undefined)/i.test(unitNode.textContent[windowStart]) ){
                // The regex is used to avoid false matches like "200 fish", in which it would get a match because "200 f" is seen
                // Because of the regex that is avoided since the letter att windowStart would be "200 fIsh" and would not be matched
                unitNode.textContent = insert(unitNode.textContent, windowStart, `【${numericString} ${unitString}】`)
                break
            }
            else if (unitNode.textContent[windowStart] != "【"){
                break
            }
            // If the letter encountered is an 【 then the search shall continue because that match has been visited earlier, instead the windowStart is used to ignore the previous match
            iterations += 1
            // The iterations is unsed to prevent a possible infinite loop
        }
        

    }
    return document.body
}

export async function main(reciveData){
    var data = await reciveData;
    if (Object.keys(data).length === 0) {
        data = defaultConfig;
    } 
    else {
        data = data.data;
    }
    //Check if the reciveData method returns something, if not then use the default config
    
    for(const measurments of Object.keys(conversions)){
        //Iterate through the measurments like volume and weight
        
        const globalExpression = conversions[measurments]["regex"][data.from][0]
        const nonGlobalExpression = conversions[measurments]["regex"][data.from][1]
        if(!nonGlobalExpression.test(document.body.textContent)){
            continue
        }
        // If there exists no match in the entire body, skip
        let matchList = BeginSearch(globalExpression)
        SimpleReplace(matchList, measurments, nonGlobalExpression, data)
        //This helps avoid false positives, since recepie pages typically contain between 3 and 15 measurments of each kind a matchlist with only one match is probably a false positive
    }
}
if(typeof process === "undefined"){
    if(typeof browser === "undefined"){
        chrome.storage.onChanged.addListener(() => location.reload())
    }
    else{
        browser.storage.onChanged.addListener(() => location.reload())
    }
    main(getStorageData("data"))
}
// This is to aide in testing, since if the script is run in a node ENV the process will be defined, and this should not get ran

