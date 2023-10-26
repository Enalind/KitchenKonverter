

import { conversions } from "./constants";
import { checkForMissingItems, calculateUnitString, getStorageData } from "./utils";
import { decimalToFractionLookup, commonUnicodeFractions, fractionMatcherRegex, singularFractionRegex, defaultConfig} from "./constants";


// Check this out on why regex is dumb if it is global https://dev.to/dvddpl/why-is-my-regex-working-intermittently-4f4g

export function searchChildrenRecursively(childNode, node, matches, expression, nonGlobalRegex, matchList){
    let isNotRemaining = false
    for(const grandchild of childNode.children){
        if(grandchild.tagName == "SCRIPT" || !grandchild.textContent){continue;}
        //If the grandchild is a script tag, skip it
        const testable = grandchild.textContent
        if(nonGlobalRegex.test(testable)){
            //Check if expression matches the regex
            const grandchildMatches = grandchild.textContent.match(expression)
            //Isolate the matched regex
            searchChildrenRecursively(grandchild, childNode, grandchildMatches, expression, nonGlobalRegex, matchList)
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

function getDirectlyContainedText(node){
    return Array.prototype.filter
    .call(node.childNodes, (child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent)
    .join('')
}

export function searchAlternative(childNode, node, matches, expression, nonGlobalRegex, matchList){
    const stack = [node]
    const visited = new Set()
    const result = []

    while (stack.length){
        const vertex = stack.pop()
        if(!visited.has(vertex)){
            visited.add(vertex)
            const directlyContainedText = getDirectlyContainedText(vertex)
            if(nonGlobalRegex.test(directlyContainedText)){
                matchList.push([vertex, directlyContainedText.match(expression)])
            }
            stack.push(...vertex.children)
        }
        // push children to stack https://hackernoon.com/a-beginners-guide-to-bfs-and-dfs-in-javascript
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
                        if(unitPart == unit["name"] | unit.abbr.includes(unitPart) && !unitFound){
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
                if(numericNode.getAttribute("kitchen-converted")?.includes(contextPart) || unitNode.getAttribute("kitchen-converted")?.includes(contextPart)){
                    continue
                }
                //Check if the node has already been visited
                if(numericNode == unitNode){
                    //Check if the root node specified in the matchList was indeed the lowest
                    numericNode.setAttribute("kitchen-converted", contextPart)
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
                    numericNode.setAttribute("kitchen-converted", contextPart)
                    unitNode.setAttribute("kitchen-converted", contextPart)
                    //Mark both as visited
                }
            }
        }
        
    }
    return document.body.innerHTML
}
export async function main(rootNode, reciveData){
    var data = await reciveData;
    if (Object.keys(data).length === 0) {
        data = defaultConfig;
    } 
    else {
        data = data.data;
    }
    
    
    for(const measurments of Object.keys(conversions)){
        var matchList = []
        //Iterate through the measurments like volume and weight
        const globalExpression = conversions[measurments]["regex"][data.from][0]
        const nonGlobalExpression = conversions[measurments]["regex"][data.from][1]
        if(!globalExpression.test(rootNode.textContent)){
            continue
        }
        //If the body does not contain any matches, halt execution
        searchChildrenRecursively(rootNode, null, null, globalExpression, nonGlobalExpression, matchList)
        //Begin the recursive search at the root node, often the body
        console.log(matchList, measurments, globalExpression, rootNode.textContent)
        // console.log([...rootNode.textContent.matchAll(globalExpression)])
        //Initialize dummy data
        updateMatches(matchList, nonGlobalExpression, measurments, data)
        //Update the matches found in the search
    }
}
if(typeof process === "undefined"){
    if(typeof browser === "undefined"){
        chrome.storage.onChanged.addListener(() => location.reload())
    }
    else{
        browser.storage.onChanged.addListener(() => location.reload())
    }
    main(document.querySelector("body"), getStorageData("data"))
}

