

import { conversions } from "./constants";
import { checkForMissingItems, calculateUnitString } from "./utils";
import { decimalToFractionLookup, commonUnicodeFractions } from "./constants";

const fractionMatcherRegex = /([0-9])+([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/
const singularFractionRegex = /([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/


export function searchChildrenRecursively(childNode, node, matches, expression, matchList){
    let flag = false
    // if(childNode.textContent.includes("3/4 cup (about 90g) chopped pecans or walnuts")){
    //     debugger
    // }
    for(const grandchild of childNode.children){
        if(grandchild.tagName == "SCRIPT" || !grandchild.textContent){continue;}
        
        if(expression.test(grandchild.textContent)){
            const grandchildMatches = grandchild.textContent.match(expression)
            searchChildrenRecursively(grandchild, childNode, grandchildMatches, expression, matchList)
            flag = true
        }
    }
    if(node != null && !flag){
        matchList.push([childNode, matches])
    }
    const remainingMatchList = checkForMissingItems(node, matches, expression, matchList)
    if(node != null && remainingMatchList.length > 0){
        matchList.push([childNode, remainingMatchList])
    }
}


export function updateMatches(matchList, nonGlobalExpression, measureType, measurementsData){
    for(const [node, matches] of matchList){
        for(let match of matches){
            match = match.match(nonGlobalExpression)
            
            if(match[2]){
                let numericNode = node
                let unitNode = node
                const numericPart = match[2]
                const unitPart = match[3]
                const contextPart = match[4]
                
                for(const child of node.children){
                    if(child.textContent?.includes(unitPart + contextPart) && unitNode == node){
                        unitNode = child
                    }
                }
                for(const child of node.children){
                    if(child.textContent?.includes(numericPart) && numericNode == node){
                        numericNode = child
                    }
                    else if(numericNode != node && child.nextElementSibling == unitNode){
                        numericNode = child
                    }
                }
                var convertedQuantity = 0
                
                if(numericPart.includes("/")){
                    convertedQuantity = parseFloat(numericPart.split("/")[0]) / parseFloat(numericPart.split("/")[1])
                }
                else if(fractionMatcherRegex.test(numericPart)){
                    const fractionMatch = numericPart.match(fractionMatcherRegex)
                    const fractionalQuantity = commonUnicodeFractions[fractionMatch[2]]
                    convertedQuantity = parseInt(fractionMatch[1]) + (parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]))
                }
                else if(singularFractionRegex.test(numericPart)){
                    const fractionMatch = numericPart.match(singularFractionRegex)
                    const fractionalQuantity = commonUnicodeFractions[fractionMatch[0]]
                    convertedQuantity = parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1])
                }
                else{
                    convertedQuantity = parseFloat(numericPart)
                }

                conversions[measureType][measurementsData.from].forEach(unit => {
                    if(unitPart == unit["name"] | unit.abbr.includes(unitPart)){
                        convertedQuantity = convertedQuantity * unit.standard
                        console.log(unit, convertedQuantity)
                    }
                })
                
                let [numericString, unitString] =  calculateUnitString(convertedQuantity, conversions[measureType].shared ? conversions[measureType][measurementsData.to].concat(conversions[measureType].shared) : conversions[measureType][measurementsData.to], decimalToFractionLookup);
                if(numericNode.hasAttribute("kitchen-converted") || unitNode.hasAttribute("kitchen-converted")){
                    continue
                }
                if(numericNode == unitNode){
                    numericNode.setAttribute("kitchen-converted", "true")
                    const newString = match[1] + numericString + " " + unitString + contextPart
                    console.log(newString, match[0])
                    node.innerHTML = node.innerHTML.replaceAll(match[0], newString)
                    
                }
                else{
                    numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString)
                    unitNode.innerHTML = unitNode.innerHTML.replaceAll(unitPart, unitString)
                    numericNode.setAttribute("kitchen-converted", "true")
                    unitNode.setAttribute("kitchen-converted", "true")
                }
            }
        }
        
    }
    return document.body.innerHTML
}
// // TODO: Add support for 1½ style notation
export function main(rootNode, language){
    var matchList = []
    for(const measurments of Object.keys(conversions)){
        const globalExpression = conversions[measurments]["regex"][language][0]
        if(!globalExpression.test(rootNode.textContent)){
            continue
        }
        searchChildrenRecursively(rootNode, null, null, globalExpression, matchList)
        const data = {
            "from": "us",
            "to": "metric"
        }
        updateMatches(matchList, conversions[measurments]["regex"][language][1], measurments, data)
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
    var usVolumeRegex = "/(\\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\\sand)*(?:[0-9/]*)\\s*("
    metricVolumeList.forEach(volume => {
        usVolumeRegex = usVolumeRegex + "|" + volume
    })
    usVolumeRegex = usVolumeRegex + ")(s?[^\\n]{0,10})/gi"
    var metricVolumeRegex = "/(\\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\\sand)*(?:[0-9/]*)\\s*("
    metricVolumeList.forEach(volume => {
        metricVolumeRegex = metricVolumeRegex + "|" + volume
    })
    metricVolumeRegex = metricVolumeRegex + ")(s?[^\\n]{0,10})/gi"
    console.log(usVolumeRegex, metricVolumeRegex)
}
// outputJson()
main(document.querySelector("body"), "us")
