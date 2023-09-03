function farenheitToCelsius(farenheit){
    return (0.55 * (farenheit - 32)).toFixed(1)
}

function celsiusToFarenheit(celsius){
    return (celsius * 1.8 + 32).toFixed(1)
}
const conversions = {
  "volume": {
      "us": [
          {
              "name": "fluid ounce",
              "abbr": [
                  "fl oz",
                  "fl. oz"
              ],
              "standard": 30
          },
          {
              "name": "cup",
              "abbr": [
                "cup"
              ],
              "standard": 237
          },
          {
              "name": "quart",
              "abbr": [
                  "qt."
              ],
              "standard": 946
          },
          {
              "name": "gallon",
              "abbr": [
                  "gal"
              ],
              "standard": 3785
          }
      ],
      "metric": [
          {
              "name": "milliliter",
              "abbr": [
                  "ml"
              ],
              "standard": 1
          },
          {
              "name": "centiliter",
              "abbr": [
                  "cl"
              ],
              "standard": 10
          },
          {
              "name": "deciliter",
              "abbr": [
                  "dl"
              ],
              "standard": 100
          },
          {
              "name": "liter",
              "abbr": [
                  "l"
              ],
              "standard": 1000
          }
      ],
      "shared": [
          {
              "name": "teaspoon",
              "abbr": [
                  "tsp"
              ],
              "standard": 5
          },
          {
              "name": "tablespoon",
              "abbr": [
                  "tbsp"
              ],
              "standard": 15
          }
      ]
  },
  "weight": {
      "us": [
          {
              "name": "ounce",
              "abbr": [
                  "oz"
              ],
              "standard": 28
          },
          {
              "name": "pound",
              "abbr": [
                  "lb"
              ],
              "standard": 453
          }
      ],
      "metric": [
          {
              "name": "gram",
              "abbr": [
                  "g"
              ],
              "standard": 1
          },
          {
              "name": "kilogram",
              "abbr": [
                  "kg"
              ],
              "standard": 1000
          }
      ]
  },
  "temperature": {
      "us": [
          {
              "name": "farenheit",
              "abbr": [
                  "f"
              ],
              "conversionFunction": {
                "metric": farenheitToCelsius
              }
          }
      ],
      "metric": [
          {
              "name": "celsius",
              "abbr": [
                  "c",
                  "centigrade"
              ],
              "conversionFunction": {
                "us": celsiusToFarenheit
              }
          }
      ]
  }
}


const defaults = {
  "from": "metric",
  "to": "us"
}



const commonUnicodeFractions = {
    "½": "1/2",
    "¼": "1/4",
    "¾": "3/4",
    "⅓": "1/3",
    "⅔": "2/3",
    "⅕": "1/5",
    "⅖": "2/5",
    "⅗": "3/5",
    "⅘": "4/5",
    "⅙": "1/6",
    "⅚": "5/6",
    "⅛": "1/8",
    "⅜": "3/8",
    "⅝": "5/8",
    "⅞": "7/8",
};

const decimalToFractionLookup = {
    0.1 : "1/10",
    0.2 : "1/5",
    0.3 : "1/3",
    0.4 : "2/5",
    0.5 : "1/2",
    0.6 : "3/5",
    0.7 : "2/3",
    0.8 : "3/4",
    0.9 : "9/10" 
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

function decimalToFraction(fraction, unit){
    let secondTerm = fraction % 1
    const firstTerm = parseInt(fraction - secondTerm)
    secondTerm = secondTerm.toFixed(1)
    secondTerm = decimalToFractionLookup[secondTerm]
    if(fraction === 1){
        return "1 " + unit
    }
    
    if(fraction > 1){
        if(secondTerm === 0 || secondTerm === undefined){
            return firstTerm + " " + unit + "s"
        }
        return firstTerm + " and " + secondTerm + " " + unit + "s"
    }
    return(secondTerm + " " + unit)
}


function calculateUnitString(measure, unitList){
    sortByKey(unitList, "standard")

    for(const unit of unitList){
        
        if(measure > 0.5 * unit.standard){
            return(decimalToFraction((measure/unit.standard).toFixed(1), unit.abbr[0]))
        }
    }
    const smallestUnit = unitList[unitList.length-1]
    return(decimalToFraction(smallestUnit.standard/measure, smallestUnit.abbr[0]))
}

function searchChildNodesRecursively(element, exp){
    
    if(!element.hasChildNodes()){
        return element
    }
    for(const node of element.childNodes){
        const test = exp.test(node.innerText)
        if(test){
            return searchChildNodesRecursively(node, exp)
        }
    }
    return element
}   



function convertMeasure(elements, measure, data) {
    
  const unicodeFractionRegex = new RegExp(`[${Object.keys(commonUnicodeFractions).join('')}]`, 'g');

  for (const unit of conversions[measure][data.from]) {
    const aliases = unit.abbr.slice(); // Make a copy of the abbr array
    aliases.push(unit.name)
    for (const alias of aliases) {
      const exp = new RegExp(`(?<leadingNumber>[0-9\\/.,]*)(\\sand)?\\s?(?<number>[0-9\\/.,]*)\\s*(${alias})s?(\\w*)`, 'gi');
      for (var element of elements) {
        if(element.innerText.includes("2/3 cup") && alias == "cup"){
            debugger
        }
        let extraSpace = false
        let check = element.innerText.replace(unicodeFractionRegex, match => commonUnicodeFractions[match]);
        if(exp.test(check)){
            element = searchChildNodesRecursively(element, exp)
        }
        check = element.innerText.replace(unicodeFractionRegex, match => commonUnicodeFractions[match]);
        const matches = [...check.matchAll(exp)] 
        for (const match of matches) {
          if(match[5]){
            continue
          }
          let quantity = 0
          if(match.groups.leadingNumber.includes('/')){
            extraSpace = match[2] !== undefined
            quantity = parseInt(match.groups.leadingNumber.split("/")[0], 10) / parseInt(match.groups.leadingNumber.split("/")[1], 10);
          }
          else if(match.groups.number.includes('/')){
            extraSpace = match[2] !== undefined
            const split =  match.groups.number.split("/")
            quantity = parseInt(split[0], 10) / parseInt(split[1], 10);
          }
          else if(match.groups.number === "" || !match.groups.number){
            quantity = parseFloat(match.groups.leadingNumber.replace(',', '.'));
          }
          else{
            quantity = parseFloat(match.groups.number.replace(',', '.'));
          }
           // Handle comma as decimal separator 
          if (!isNaN(quantity)) {
            extraSpace = match[0][0] === " " ? " ": ""
            
            var convertedQuantity = quantity * unit.standard;
            if(data.factor){
                console.log(data.factor)
                convertedQuantity = convertedQuantity * data.factor
            }
            const newString = extraSpace + calculateUnitString(convertedQuantity, conversions[measure].shared ? conversions[measure][data.to].concat(conversions[measure].shared): conversions[measure][data.to]);
            // debugger
            // Replace the old string with the new string
            
            element.innerText =  check.replace(match[0], newString);
            
            // Update the element in your data structure or output the updated element
            // For example: elements[elementIndex] = updatedElement;
          }
          
        }
      }
    }
  }
}



function convertTemperature(elements, data){
    let aliases = conversions.temperature[data.from][0].abbr
    aliases.push(conversions.temperature[data.from][0].name)
    for(const alias of aliases){
        const exp = new RegExp(`(?<temperature>[0-9\\/.,]+)[°\\s]*${alias}($|\\W+)`, "gi")
        for (var element of elements) {
            if(exp.test(element.innerText)){
                element = searchChildNodesRecursively(element, exp)
            }
            const matches = [...element.innerText.matchAll(exp)]
            for (const match of matches) {
                let quantity = parseFloat(match.groups.temperature.replace(',', '.'));
                quantity = conversions.temperature[data.from][0].conversionFunction[data.to](quantity)
                if (!isNaN(quantity)) {
                    element.innerText = element.innerText.replace(match[0], quantity + "° " + conversions.temperature[data.to][0].abbr[0].toUpperCase() + match[2])
                }
            }
        }
    }
    
}
const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )

async function init(){
    var data = await getStorageData("data")
    if(Object.keys(data).length === 0){
        data = defaults
    }
    else{
        data = data.data
    }
    const elements = document.querySelectorAll('span, p, li')
    convertMeasure(elements, "volume", data);
    convertMeasure(elements, "weight", data);
    convertTemperature(elements, data)
}

async function recivedMessage(changes, namespace){
    location.reload()
    // var data = changes.data.newValue
    // const elements = document.querySelectorAll('span, p, li')
    // convertMeasure(elements, "volume", data);
    // convertMeasure(elements, "weight", data);
    // convertTemperature(elements, data)
}
if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.storage.onChanged.addListener(recivedMessage)


init()


