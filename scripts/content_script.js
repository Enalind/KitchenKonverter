function farenheitToCelsius(farenheit){
    return (0.55 * (farenheit - 32)).toFixed(1)
}

function celsiusToFarenheit(celsius){
    return (celsius * 1.8 + 32).toFixed(1)
}
//These are pretty self explanatory functions to convert between Celsius and Farenheit
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


const defaultConfig = {
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
//This function is made to sort the units in a conversion object by the standard value of the unit

function decimalToFraction(decimalValue, unit) {
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
            return wholePart + " " + unit + "s";
        }
        return wholePart + " and " + fractionalPart + " " + unit + "s";
    }

    // Handle cases when decimalValue is less than 1
    return (fractionalPart + " " + unit);
}

function calculateUnitString(measureValue, unitList) {
    // Sort the unitList by the "standard" property
    sortByKey(unitList, "standard");

    for (const unit of unitList) {
        // Check if the measureValue is greater than half of the unit's standard value
        if (measureValue > 0.5 * unit.standard) {
            const measureFraction = (measureValue / unit.standard).toFixed(1);
            const unitAbbreviation = unit.abbr[0];
            return decimalToFraction(measureFraction, unitAbbreviation);
        }
    }

    // If none of the units in unitList match, use the smallest unit
    const smallestUnit = unitList[unitList.length - 1];
    const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
    const unitAbbreviation = smallestUnit.abbr[0];
    return decimalToFraction(measureFraction, unitAbbreviation);
}

function searchChildNodesRecursively(parentElement, searchExpression) {
    // If the parentElement has no child nodes, return the parentElement itself
    if (!parentElement.hasChildNodes()) {
        return parentElement;
    }
    
    // Iterate through the child nodes of the parentElement
    for (const childNode of parentElement.childNodes) {
        // Test the child node's inner text against the searchExpression
        const doesMatch = searchExpression.test(childNode.innerText);
        
        if (doesMatch) {
            // If a match is found, recursively search its child nodes
            return searchChildNodesRecursively(childNode, searchExpression);
        }
    }
    
    // If no match is found in any child nodes, return the parentElement
    return parentElement;
}



function convertMeasure(elements, measureType, conversionData) {
    // Regular expression to match common Unicode fractions
    const unicodeFractionRegex = new RegExp(`[${Object.keys(commonUnicodeFractions).join('')}]`, 'g');
  
    // Iterate through the unit conversions for the specified measure type and source unit
    for (const sourceUnit of conversions[measureType][conversionData.from]) {
      // Create an array of unit aliases, including the abbreviation and name
      const unitAliases = sourceUnit.abbr.slice();
      unitAliases.push(sourceUnit.name);
  
      // Iterate through each alias for the source unit
      for (const alias of unitAliases) {
        // Define a regular expression pattern to match quantity expressions with the alias
        const quantityExp = new RegExp(`(?<leadingNumber>[0-9\\/.,]*)(\\sand)?\\s?(?<number>[0-9\\/.,]*)\\s*(${alias})s?(\\w*)`, 'gi');
        
        // Iterate through the elements to perform conversions
        for (var element of elements) {
          
          let extraSpace = false;
          let textToCheck = element.innerText.replace(unicodeFractionRegex, match => commonUnicodeFractions[match]);
  
          // Check if the quantity expression matches
          if (quantityExp.test(textToCheck)) {
            element = searchChildNodesRecursively(element, quantityExp);
          }
  
          textToCheck = element.innerText.replace(unicodeFractionRegex, match => commonUnicodeFractions[match]);
          const matches = [...textToCheck.matchAll(quantityExp)];
  
          // Iterate through matched quantity expressions
          for (const match of matches) {
            if (match[5]) {
              continue;
            }
  
            let quantity = 0;
  
            if (match.groups.leadingNumber.includes('/')) {
              extraSpace = match[2] !== undefined;
              quantity = parseInt(match.groups.leadingNumber.split("/")[0], 10) / parseInt(match.groups.leadingNumber.split("/")[1], 10);
            } else if (match.groups.number.includes('/')) {
              extraSpace = match[2] !== undefined;
              const split = match.groups.number.split("/");
              quantity = parseInt(split[0], 10) / parseInt(split[1], 10);
            } else if (match.groups.number === "" || !match.groups.number) {
              quantity = parseFloat(match.groups.leadingNumber.replace(',', '.'));
            } else {
              quantity = parseFloat(match.groups.number.replace(',', '.'));
            }
  
            // Handle comma as a decimal separator
            if (!isNaN(quantity)) {
              extraSpace = match[0][0] === " " ? " " : "";
              var convertedQuantity = quantity * sourceUnit.standard;
  
              if (conversionData.factor) {
                convertedQuantity = convertedQuantity * conversionData.factor;
              }
  
              const newString = extraSpace + calculateUnitString(convertedQuantity, conversions[measureType].shared ? conversions[measureType][conversionData.to].concat(conversions[measureType].shared) : conversions[measureType][conversionData.to]);
  
              element.innerText = textToCheck.replace(match[0], newString);
            }
          }
        }
      }
    }
  }
  



  function convertTemperature(elements, conversionData) {
    // Get aliases for the source temperature unit
    let sourceUnitAliases = conversions.temperature[conversionData.from][0].abbr;
    sourceUnitAliases.push(conversions.temperature[conversionData.from][0].name);

    // Iterate through each alias for the source temperature unit
    for (const sourceAlias of sourceUnitAliases) {
        // Define a regular expression pattern to match temperature expressions with the alias
        const temperatureExp = new RegExp(`(?<temperature>[0-9\\/.,]+)[°\\s]*${sourceAlias}($|\\W+)`, "gi");

        // Iterate through the elements to perform temperature conversions
        for (var element of elements) {
            // Check if the temperature expression matches
            if (temperatureExp.test(element.innerText)) {
                element = searchChildNodesRecursively(element, temperatureExp);
            }

            const matches = [...element.innerText.matchAll(temperatureExp)];

            // Iterate through matched temperature expressions
            for (const match of matches) {
                let temperatureValue = parseFloat(match.groups.temperature.replace(',', '.'));
                temperatureValue = conversions.temperature[conversionData.from][0].conversionFunction[conversionData.to](temperatureValue);

                if (!isNaN(temperatureValue)) {
                    element.innerText = element.innerText.replace(match[0], temperatureValue + "° " + conversions.temperature[conversionData.to][0].abbr[0].toUpperCase() + match[2]);
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

  async function init() {
    // Retrieve data from Chrome storage using the "getStorageData" function
    var data = await getStorageData("data");
  
    // Check if there is any data in storage; if not, use defaults
    if (Object.keys(data).length === 0) {
      data = defaultConfig;
    } else {
      data = data.data;
    }
  
    // Select all 'span', 'p', and 'li' elements in the current page
    const elements = document.querySelectorAll('span, p, li');
  
    // Perform volume conversions using the "convertMeasure" function
    convertMeasure(elements, "volume", data);
  
    // Perform weight conversions using the "convertMeasure" function
    convertMeasure(elements, "weight", data);
  
    // Perform temperature conversions using the "convertTemperature" function
    convertTemperature(elements, data);
  }

// Define an async function to handle received messages (storage changes)
async function receivedMessage(changes, namespace) {
    // Reload the current page
    location.reload();
  }
  
  // Check if the "browser" object is defined (for compatibility with different browsers)
  if (typeof browser === "undefined") {
    var browser = chrome;
  }
  
  // Add the "receivedMessage" function as a listener for storage changes
  browser.storage.onChanged.addListener(receivedMessage);
  
  // Initialize the application
  init();


