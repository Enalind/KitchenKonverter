(() => {
  // src/constants.js
  function celsiusToFarenheit(celsius) {
    return (celsius * 1.8 + 32).toFixed(1);
  }
  function farenheitToCelsius(farenheit) {
    return (0.55 * (farenheit - 32)).toFixed(1);
  }
  var commonUnicodeFractions = {
    "\xBD": "1/2",
    "\xBC": "1/4",
    "\xBE": "3/4",
    "\u2153": "1/3",
    "\u2154": "2/3",
    "\u2155": "1/5",
    "\u2156": "2/5",
    "\u2157": "3/5",
    "\u2158": "4/5",
    "\u2159": "1/6",
    "\u215A": "5/6",
    "\u215B": "1/8",
    "\u215C": "3/8",
    "\u215D": "5/8",
    "\u215E": "7/8"
  };
  var conversions = {
    "volume": {
      "regex": {
        "us": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt.|gallon|gal|teaspoon|tsp|tablespoon|tbsp)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt.|gallon|gal|teaspoon|tsp|tablespoon|tbsp)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(milliliter|ml|centiliter|cl|deciliter|dl|liter|l|teaspoon|tsp|tablespoon|tbsp)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(milliliter|ml|centiliter|cl|deciliter|dl|liter|l|teaspoon|tsp|tablespoon|tbsp)(s?[^\n]{0,10})/i]
      },
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
          "standard": 1e3
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
      "regex": {
        "us": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(ounce|oz|pound|lb)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(ounce|oz|pound|lb)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(gram|g|kilogram|kg)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(gram|g|kilogram|kg)(s?[^\n]{0,10})/i]
      },
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
          "standard": 1e3
        }
      ]
    },
    "temperature": {
      "regex": {
        "us": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(farenheit|f)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(farenheit|f)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(celsius|c|centigrade)(s?[^\n]{0,10})/gi, /(\s*)([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand)*(?:[0-9/]*)\s*(celsius|c|centigrade)(s?[^\n]{0,10})/i]
      },
      "us": [
        {
          "name": "farenheit",
          "abbr": [
            "f"
          ],
          "conversionFunction": {
            "metric": celsiusToFarenheit
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
            "us": farenheitToCelsius
          }
        }
      ]
    }
  };
  var decimalToFractionLookup = {
    0.1: "1/10",
    0.2: "1/5",
    0.3: "1/3",
    0.4: "2/5",
    0.5: "1/2",
    0.6: "3/5",
    0.7: "2/3",
    0.8: "3/4",
    0.9: "9/10"
  };

  // src/utils.js
  function decimalToFraction(decimalValue, unit, decimalToFractionLookup2) {
    let fractionalPart = decimalValue % 1;
    const wholePart = parseInt(decimalValue - fractionalPart);
    fractionalPart = fractionalPart.toFixed(1);
    fractionalPart = decimalToFractionLookup2[fractionalPart];
    if (decimalValue === 1) {
      return "1 " + unit;
    }
    if (decimalValue > 1) {
      if (fractionalPart === 0 || fractionalPart === void 0) {
        const unitPart2 = unit + "s";
        return [wholePart, unitPart2];
      }
      const numericPart = wholePart + " and " + fractionalPart;
      const unitPart = unit + "s";
      return [numericPart, unitPart];
    }
    return [fractionalPart, unit];
  }
  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? 1 : x > y ? -1 : 0;
    });
  }
  function calculateUnitString(measureValue, unitList, decimalToFractionLookup2) {
    console.log(unitList);
    sortByKey(unitList, "standard");
    for (const unit of unitList) {
      if (measureValue > 0.5 * unit.standard) {
        const measureFraction2 = (measureValue / unit.standard).toFixed(1);
        const unitAbbreviation2 = unit.abbr[0];
        return decimalToFraction(measureFraction2, unitAbbreviation2, decimalToFractionLookup2);
      }
    }
    const smallestUnit = unitList[unitList.length - 1];
    const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
    const unitAbbreviation = smallestUnit.abbr[0];
    return decimalToFraction(measureFraction, unitAbbreviation, decimalToFractionLookup2);
  }
  function checkForMissingItems(node, matches, expression, matchList) {
    let concatMatchList = [];
    matchList.forEach((element) => concatMatchList.push(...element[1]));
    let crossReferencedMatchList = [];
    matches?.forEach((element) => {
      if (concatMatchList.map((ele) => ele.trim() == element.trim()).every((v) => v === false) && !concatMatchList.join("").includes(element)) {
        crossReferencedMatchList.push(element);
      }
    });
    return crossReferencedMatchList;
  }

  // src/content_script.js
  var fractionMatcherRegex = /([0-9])+([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/;
  var singularFractionRegex = /([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/;
  function searchChildrenRecursively(childNode, node, matches, expression, matchList) {
    let flag = false;
    for (const grandchild of childNode.children) {
      if (grandchild.tagName == "SCRIPT" || !grandchild.textContent) {
        continue;
      }
      if (expression.test(grandchild.textContent)) {
        const grandchildMatches = grandchild.textContent.match(expression);
        searchChildrenRecursively(grandchild, childNode, grandchildMatches, expression, matchList);
        flag = true;
      }
    }
    if (node != null && !flag) {
      matchList.push([childNode, matches]);
    }
    const remainingMatchList = checkForMissingItems(node, matches, expression, matchList);
    if (node != null && remainingMatchList.length > 0) {
      matchList.push([childNode, remainingMatchList]);
    }
  }
  function updateMatches(matchList, nonGlobalExpression, measureType, conversionData) {
    for (const [node, matches] of matchList) {
      for (let match of matches) {
        match = match.match(nonGlobalExpression);
        if (match[2]) {
          let numericNode = node;
          let unitNode = node;
          const numericPart = match[2];
          const unitPart = match[3];
          const contextPart = match[4];
          for (const child of node.children) {
            if (child.textContent?.includes(unitPart + contextPart) && unitNode == node) {
              unitNode = child;
            }
          }
          for (const child of node.children) {
            if (child.textContent?.includes(numericPart) && numericNode == node) {
              numericNode = child;
            } else if (numericNode != node && child.nextElementSibling == unitNode) {
              numericNode = child;
            }
          }
          var convertedQuantity = 0;
          if (numericPart.includes("/")) {
            convertedQuantity = parseFloat(numericPart.split("/")[0]) / parseFloat(numericPart.split("/")[1]);
          } else if (fractionMatcherRegex.test(numericPart)) {
            const fractionMatch = numericPart.match(fractionMatcherRegex);
            const fractionalQuantity = commonUnicodeFractions[fractionMatch[2]];
            convertedQuantity = parseInt(fractionMatch[1]) + parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]);
          } else if (singularFractionRegex.test(numericPart)) {
            const fractionMatch = numericPart.match(singularFractionRegex);
            const fractionalQuantity = commonUnicodeFractions[fractionMatch[0]];
            convertedQuantity = parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]);
          } else {
            convertedQuantity = parseFloat(numericPart);
          }
          conversions[measureType][conversionData.from].forEach((unit) => {
            if (unitPart == unit["name"] | unit.abbr.includes(unitPart)) {
              convertedQuantity = convertedQuantity * unit.standard;
            }
          });
          let [numericString, unitString] = calculateUnitString(convertedQuantity, conversions[measureType].shared ? conversions[measureType][conversionData.to].concat(conversions[measureType].shared) : conversions[measureType][conversionData.to], decimalToFractionLookup);
          if (numericNode.hasAttribute("kitchen-converted") || unitNode.hasAttribute("kitchen-converted")) {
            continue;
          }
          if (numericNode == unitNode) {
            numericNode.setAttribute("kitchen-converted", "true");
            const newString = match[1] + numericString + " " + unitString + contextPart;
            node.innerHTML = node.innerHTML.replaceAll(match[0], newString);
          } else {
            numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString);
            unitNode.innerHTML = unitNode.innerHTML.replaceAll(unitPart, unitString);
            numericNode.setAttribute("kitchen-converted", "true");
            unitNode.setAttribute("kitchen-converted", "true");
          }
        }
      }
    }
    return document.body.innerHTML;
  }
  function main(rootNode, language) {
    var matchList = [];
    for (const measurments of Object.keys(conversions)) {
      console.log(conversions[measurments][language]);
      const globalExpression = conversions[measurments]["regex"][language][0];
      if (!globalExpression.test(rootNode.textContent)) {
        continue;
      }
      searchChildrenRecursively(rootNode, null, null, globalExpression, matchList);
      const data = {
        "from": "us",
        "to": "metric"
      };
      updateMatches(matchList, conversions[measurments]["regex"][language][1], measurments, data);
    }
  }
  main(document.querySelector("body"), "us");
})();
