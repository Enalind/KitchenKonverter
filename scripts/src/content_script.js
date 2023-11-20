import { conversions, slashFractionMatcherRegex } from "./constants";
import { calculateUnitString, getStorageData, getDirectlyContainedText } from "./utils";
import { decimalToFractionLookup, commonUnicodeFractions, fractionMatcherRegex, singularFractionRegex, defaultConfig} from "./constants";

export function searchForSplitNodes(childNode, node, matches, expression, nonGlobalRegex, matchList){
    let isNotRemaining = false
    for(const grandchild of childNode.children){
        if(grandchild.tagName == "SCRIPT" | grandchild.tagName == "STYLE" | !grandchild.textContent){continue;}
        //If the grandchild is a script or style tag, skip it
        const testable = grandchild.textContent
        if(nonGlobalRegex.test(testable)){
            //Check if expression matches the regex
            const grandchildMatches = grandchild.textContent.match(expression)
            //Isolate the matched regex
            searchForSplitNodes(grandchild, childNode, grandchildMatches, expression, nonGlobalRegex, matchList)
            //Recursively search the next node
            isNotRemaining = true
            //Since only the deepest node is relevant, this flag makes it so that the previous recursions are ignored
        }
    }
    if(node != null && !isNotRemaining){
        matchList.push([childNode, matches])
        //Add the matched node and the matches to the list
    }
}

export function searchForSplitHi(childNode, node, matches, expression, nonGlobalRegex, matchList){
    for(const grandchild of childNode.children){
        if(grandchild.tagName == "SCRIPT" | grandchild.tagName == "STYLE" | !grandchild.textContent){continue;}
        //If the grandchild is a script or style tag, skip it
        if(nonGlobalRegex.test(grandchild.textContent)){
            //Check if expression matches the regex
            const grandchildMatches = grandchild.textContent.match(expression)
            //Isolate the matched regex
            searchForSplitNodes(grandchild, childNode, grandchildMatches, expression, nonGlobalRegex, matchList)
            //Recursively search the next node
        }
    }
    if(node != null){
        matchList.push([childNode, matches])
        //Add the matched node and the matches to the list
    }
}

export function depthFirstSearch(node, expression, nonGlobalRegex, matchList){
    const stack = [node]
    const visited = new Set()

    while (stack.length){
        const vertex = stack.pop()
        if(!visited.has(vertex)){
            visited.add(vertex)
            const directlyContainedText = getDirectlyContainedText(vertex)
            if(nonGlobalRegex.test(directlyContainedText) && vertex.tagName != "SCRIPT" && vertex.tagName != "STYLE"){
                if(vertex.previousSibling != null){
                    const prevSiblingText = getDirectlyContainedText(vertex.previousSibling)
                    // Check for text only contained in the immediate node at hand
                    if(nonGlobalRegex.test(directlyContainedText + prevSiblingText) && prevSiblingText != "" && prevSiblingText != " "){
                        matchList.push([vertex, (prevSiblingText + directlyContainedText).match(expression), directlyContainedText])
                    }
                    
                }
                // If it is split over two nodes, add it to the list anyways
                else{
                    matchList.push([vertex, directlyContainedText.match(expression)])
                }
            }
            stack.push(...vertex.children)
        }
        
    }
}

// https://sallysbakingaddiction.com/double-chocolate-chip-cookies-recipe/
export function updateMatches(matchList, unitFindRegex, measureType, languageInfo){
    for(const [node, matches, splitNodeText] of matchList){
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
                    if(child.textContent?.includes(unitPart) && unitNode == node){
                        unitNode = child
                    }
                }
                // Check if the unit string is the lowest node it can be in the DOM, otherwise find it and make it so that the unit node is the lowest it can be
                for(const child of node.children){
                    if(child.textContent?.includes(numericPart.replace(" ", "")) && numericNode == node){
                        numericNode = child
                    }
                    else if(numericNode != node && child.nextElementSibling == unitNode){
                        numericNode = child
                    }
                }
                console.log(node.innerHTML, match)
                if(numericPart.includes("and")){
                    let numericSplitted = numericPart.split(" and ")
                    var numericBeforeAndNode = numericNode
                    var numericAfterAndNode = numericNode
                    console.log(numericSplitted)
                    for(const child of node.children){
                        if(child.textContent?.includes(numericSplitted[0].replace(" ", "")) && numericBeforeAndNode == node){
                            numericBeforeAndNode = child
                        }
                        else if (child.textContent?.includes(numericSplitted[1].replace(" ", "")) && numericAfterAndNode == node){
                            numericAfterAndNode = child
                        }
                    }
                    console.log(numericBeforeAndNode.textContent, numericAfterAndNode.textContent)
                }
                
                //Do the same thing with the numeric node
                if(numericNode.tagName == "SCRIPT" || numericNode.tagName == "STYLE" || unitNode.tagName == "SCRIPT" || unitNode.tagName == "STYLE" || numericNode.tagName == "NOSCRIPT"){continue}
                //Check if the nodes are script or style tags, in that case skip this match
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
                //Otherwise, parse it as a float like so: 1.5; 2 or 3,5

                if(measureType != "temperature"){
                    var unitFound = false
                    conversions[measureType][languageInfo.from].forEach(unit => {
                        if(unitPart.toLowerCase().replace(" ", "") == unit["name"] | unit.abbr.includes(unitPart.toLowerCase()) && !unitFound){
                            unitFound = true
                            convertedQuantity = convertedQuantity * unit.standard
                        }
                    })
                    if(!unitFound){console.log("unit not found"); debugger; continue}
                } 
                //Iterate through different aliases of units for the specified system and convert it
                var numericString
                var unitString
                
                if(measureType === "temperature"){
                    numericString = parseInt(conversions[measureType][languageInfo.to][0]["conversionFunction"](convertedQuantity))
                    unitString = conversions[measureType][languageInfo.to][0]["name"]
                }
                else{
                    const unitList = conversions[measureType].shared ? conversions[measureType][languageInfo.to].concat(conversions[measureType].shared) : conversions[measureType][languageInfo.to]
                    // Compile a unit list, this is neccessary since the measureType VOLUME has shared measurements like teaspoon and tablespoon, while the other measureTypes do not
                    const result = calculateUnitString(convertedQuantity, unitList, decimalToFractionLookup);
                    numericString = result[0]
                    unitString = result[1]
                }
                if(splitNodeText){
                    node.previousSibling.textContent = numericString
                    node.innerHTML = node.innerHTML.replaceAll(splitNodeText, unitString)
                }
                //This is for the times that the match is split over two nodes like so: <p>1</p><p>and 1/2</p><p>sugar</p>
                else if(numericNode == unitNode){
                    const newString = match[1] + numericString + " " + unitString + contextPart
                    node.innerHTML = node.innerHTML.replaceAll(match[0], newString)
                    //Add the unit and numeric strings together along with the context that is used to differentiate between matches in the same node 
                }
                else{
                    //Otherwise, the unit and numeric nodes are different
                    unitNode.textContent = unitNode.textContent.replaceAll(unitPart, unitString)
                    if(isSlashFractionMatched){
                        numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString )
                    }
                    //The regex removes spaces in some cases which is normally added back like below, if it is written like so: 1 1/2, then the space is not removed and therefore does not need to be added back
                    else{
                        numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString + " ")
                    }
                }
            }
        }
        
    }
    return document.body.innerHTML
    //Return the body which is usefull for testing purposes
}
export async function main(rootNode, reciveData){
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
        var matchList = []
        
        const globalExpression = conversions[measurments]["regex"][data.from][0]
        const nonGlobalExpression = conversions[measurments]["regex"][data.from][1]
        if(!globalExpression.test(rootNode.textContent)){
            continue
        }
        depthFirstSearch(rootNode, globalExpression, nonGlobalExpression, matchList)
        updateMatches(matchList, nonGlobalExpression, measurments, data)
        //Do the first search and update the nodes
        matchList = []
        searchForSplitNodes(rootNode, null, null, globalExpression, nonGlobalExpression, matchList)
        updateMatches(matchList, nonGlobalExpression, measurments, data)
        //Do the second search and update the nodes
    }
}
if(typeof process === "undefined"){
    if(typeof browser === "undefined"){
        chrome.storage.onChanged.addListener(() => location.reload())
    }
    else{
        browser.storage.onChanged.addListener(() => location.reload())
    }
    main(document.body, getStorageData("data"))
}

