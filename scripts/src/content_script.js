

import { conversions } from "./constants";
import { checkForMissingItems, calculateUnitString } from "./utils";
import { decimalToFractionLookup, commonUnicodeFractions, fractionMatcherRegex, singularFractionRegex} from "./constants";




export function searchChildrenRecursively(childNode, node, matches, expression, matchList){
    let isNotRemaining = false
    for(const grandchild of childNode.children){
        if(grandchild.tagName == "SCRIPT" || !grandchild.textContent){continue;}
        //If the grandchild is a script tag, skip it
        if(expression.test(grandchild.textContent)){
            //Check if expression matches the regex
            const grandchildMatches = grandchild.textContent.match(expression)
            //Isolate the matched regex
            searchChildrenRecursively(grandchild, childNode, grandchildMatches, expression, matchList)
            //Recursively search the next node
            isNotRemaining = true
            //Since only the deepest node is relevant, this flag makes it so that the previous recursions are ignored
        }
    }
    if(node != null && !isNotRemaining){
        matchList.push([childNode, matches])
        //Add the matched node and the matches to the list
    }
    const remainingMatchList = checkForMissingItems(matches, matchList)
    //Check if node is containing previously missed matches
    if(node != null && remainingMatchList.length > 0){
       
        matchList.push([childNode, remainingMatchList])
        //If so add them to the list
    }
}


export function updateMatches(matchList, unitFindRegex, measureType, languageInfo){
    for(const [node, matches] of matchList){
        //Iterate through the list of lists containing the DOM nodes and their respective regex matches
        for(let match of matches){
            match = match.match(unitFindRegex)
            //Go through each match and break it up into the regex groups
            if(match[2]){
                //If there are any matches, proceed
                let numericNode = node
                let unitNode = node
                let numericPart = match[2]
                const unitPart = match[4]
                const contextPart = match[5]
                // Break the regex up into more readable constants
                if(/^[A-RT-Za-rt-z]/.test(contextPart)){continue}
                // make sure that the match isn't immediately followed by a letter except for s (cupS) to prevent unwanted matches
                for(const child of node.children){
                    if(child.textContent?.includes(unitPart + contextPart) && unitNode == node){
                        unitNode = child
                    }
                }
                // Check if the unit string is the lowest node it can be in the DOM, otherwise find it and make it so that the unit node is the lowest it can be
                for(const child of node.children){
                    if(child.textContent?.includes(numericPart) && numericNode == node){
                        numericNode = child
                    }
                    else if(numericNode != node && child.nextElementSibling == unitNode){
                        numericNode = child
                    }
                }
                //Do the same thing with the numeric node
                var convertedQuantity = 0
                if(numericPart.includes("and")){
                    convertedQuantity += parseFloat(numericPart)
                    numericPart.replace(numericPart + " and ", "")
                }
                if(numericPart.includes("/")){
                    convertedQuantity += parseFloat(numericPart.split("/")[0]) / parseFloat(numericPart.split("/")[1])
                }
                //Check if the numeric part is written as a fraction like so 1/2
                else if(fractionMatcherRegex.test(numericPart)){
                    const fractionMatch = numericPart.match(fractionMatcherRegex)
                    const fractionalQuantity = commonUnicodeFractions[fractionMatch[2]]
                    convertedQuantity += parseInt(fractionMatch[1]) + (parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]))
                }
                //Check if the numeric part is written as a number and a unicode fraction like so 1½
                else if(singularFractionRegex.test(numericPart)){
                    
                    const fractionMatch = numericPart.match(singularFractionRegex)
                    const fractionalQuantity = commonUnicodeFractions[fractionMatch[0]]
                    convertedQuantity += parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1])
                }
                //Check if the numeric part is written as a unicode fraction only like so ½
                else{
                    convertedQuantity += parseFloat(numericPart.replace(",", "."))
                }
                
                //Otherwise, parse it as a float like so: 1.5; 2 or 3,5
                if(measureType != "temperature"){
                    var unitFound = false
                    conversions[measureType][languageInfo.from].forEach(unit => {
                        if(unitPart == unit["name"] | unit.abbr.includes(unitPart)){
                            unitFound = true
                            convertedQuantity = convertedQuantity * unit.standard
                        }
                    })
                    if(!unitFound){console.log("unit not found")}
                }  
                
                
                //Iterate through different aliases of units for the specified system and convert it to the metric standard such as ml or g
                var numericString
                var unitString
                if(measureType === "temperature"){
                    numericString = parseInt(conversions[measureType][languageInfo.to][0]["conversionFunction"](convertedQuantity))
                    unitString = conversions[measureType][languageInfo.to][0]["name"]
                }
                else{
                    const unitList = conversions[measureType].shared ? conversions[measureType][languageInfo.to].concat(conversions[measureType].shared) : conversions[measureType][languageInfo.to]
                    const result = calculateUnitString(convertedQuantity, unitList, decimalToFractionLookup);
                    numericString = result[0]
                    unitString = result[1]
                }
                //Take the quantity and convert it to two strings (one numeric and one unit) in the system of choice
                if(numericNode.hasAttribute("kitchen-converted") || unitNode.hasAttribute("kitchen-converted")){
                    continue
                }
                //Check if the node has already been visited
                if(numericNode == unitNode){
                    //Check if the root node specified in the matchList was indeed the lowest
                    numericNode.setAttribute("kitchen-converted", "true")
                    //Mark the node as visited
                    const newString = match[1] + numericString + " " + unitString + contextPart
                    node.innerHTML = node.innerHTML.replaceAll(match[0], newString)
                    //Add the unit and numeric strings together along with the context that is used to differentiate between matches in the same node 
                }
                else{
                    //Otherwise, the unit and numeric nodes are different
                    numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString)
                    unitNode.innerHTML = unitNode.innerHTML.replaceAll(unitPart, unitString)
                    //Replace the unit and numeric parts respectively
                    numericNode.setAttribute("kitchen-converted", "true")
                    unitNode.setAttribute("kitchen-converted", "true")
                    //Mark both as visited
                }
            }
        }
        
    }
    return document.body.innerHTML
}
export function main(rootNode, language){
    var matchList = []
    for(const measurments of Object.keys(conversions)){
        //Iterate through the measurments like volume and weight
        const globalExpression = conversions[measurments]["regex"][language][0]
        if(!globalExpression.test(rootNode.textContent)){
            continue
        }
        //If the body does not contain any matches, halt execution
        searchChildrenRecursively(rootNode, null, null, globalExpression, matchList)
        //Begin the recursive search at the root node, often the body
        const data = {
            "from": "us",
            "to": "metric"
        }
        //Initialize dummy data
        updateMatches(matchList, conversions[measurments]["regex"][language][1], measurments, data)
        //Update the matches found in the search
    }
}

function generateRegexes(){
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

main(document.querySelector("body"), "us")
