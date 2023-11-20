(() => {
  // src/constants.js
  function celsiusToFarenheit(celsius) {
    return (celsius * 1.8 + 32).toFixed(0);
  }
  function farenheitToCelsius(farenheit) {
    return (0.55 * (farenheit - 32)).toFixed(0);
  }
  var defaultConfig = {
    "from": "us",
    "to": "metric"
  };
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
  var slashFractionMatcherRegex = /([0-9])+\s([0-9]\/[0-9])/;
  var fractionMatcherRegex = /([0-9])+([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/;
  var singularFractionRegex = /([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/;
  var conversions2 = {
    "volume": {
      "regex": {
        "us": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt\.|gallon|gal)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt\.|gallon|gal)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(milliliter|ml|centiliter|cl|deciliter|dl|liter|l)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(milliliter|ml|centiliter|cl|deciliter|dl|liter|l)(s?[^\n]{0,10})/i]
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
          "abbr": [],
          "standard": 237
        },
        {
          "name": "quart",
          "abbr": [
            "qt.",
            "qt"
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
        "us": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(ounce|oz|pound|lb)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(ounce|oz|pound|lb)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(gram|g|kilogram|kg)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(gram|g|kilogram|kg)(s?[^\n]{0,10})/i]
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
        "us": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(farenheit|f|°f)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(farenheit|f|°f)(s?[^\n]{0,10})/i],
        "metric": [/(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(celsius|c|centigrade|°c)(s?[^\n]{0,10})/gi, /(\s*)(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s*(?:[0-9/\.\,]*))\s*(celsius|c|centigrade|°c)(s?[^\n]{0,10})/i]
      },
      "us": [
        {
          "name": "farenheit",
          "abbr": [
            "f",
            "\xB0f"
          ],
          "conversionFunction": celsiusToFarenheit
        }
      ],
      "metric": [
        {
          "name": "celsius",
          "abbr": [
            "c",
            "centigrade",
            "\xB0c"
          ],
          "conversionFunction": farenheitToCelsius
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
  var getStorageData = (key) => new Promise(
    (resolve, reject) => chrome.storage.sync.get(
      key,
      (result) => chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result)
    )
  );
  function decimalToFraction(decimalValue, unit, decimalToFractionLookup2, addS) {
    let fractionalPart = decimalValue % 1;
    const wholePart = parseInt(decimalValue - fractionalPart);
    if (fractionalPart === 0) {
      if (decimalValue > 1 && addS) {
        return [parseInt(decimalValue), unit + "s"];
      } else {
        return [parseInt(decimalValue), unit];
      }
    }
    fractionalPart = fractionalPart.toFixed(1);
    fractionalPart = decimalToFractionLookup2[fractionalPart];
    if (decimalValue > 1) {
      if (fractionalPart === 0 || fractionalPart === void 0) {
        const unitPart = unit + "s";
        return [wholePart, unitPart];
      }
      const numericPart = wholePart + " and " + fractionalPart;
      if (addS) {
        return [numericPart, unit + "s"];
      }
      return [numericPart, unit];
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
    sortByKey(unitList, "standard");
    for (const unit of unitList) {
      if (measureValue > 0.5 * unit.standard) {
        const measureFraction2 = (measureValue / unit.standard).toFixed(1);
        const unitAbbreviation = unit.abbr ? unit.abbr[0] : unit.name;
        return decimalToFraction(measureFraction2, unitAbbreviation, decimalToFractionLookup2, false);
      }
    }
    const smallestUnit = unitList[unitList.length - 1];
    const measureFraction = (smallestUnit.standard / measureValue).toFixed(1);
    if (smallestUnit.abbr.length > 0) {
      return decimalToFraction(measureFraction, smallestUnit.abbr[0], decimalToFractionLookup2, true);
    }
    return decimalToFraction(measureFraction, smallestUnit.name, decimalToFractionLookup2, false);
  }
  function getDirectlyContainedText(node) {
    return Array.prototype.filter.call(node.childNodes, (child) => child.nodeType === Node.TEXT_NODE).map((child) => child.textContent).join("");
  }

  // src/content_script.js
  function searchForSplitNodes(childNode, node, matches, expression, nonGlobalRegex, matchList) {
    let isNotRemaining = false;
    for (const grandchild of childNode.children) {
      if (grandchild.tagName == "SCRIPT" | grandchild.tagName == "STYLE" | !grandchild.textContent) {
        continue;
      }
      const testable = grandchild.textContent;
      if (nonGlobalRegex.test(testable)) {
        const grandchildMatches = grandchild.textContent.match(expression);
        searchForSplitNodes(grandchild, childNode, grandchildMatches, expression, nonGlobalRegex, matchList);
        isNotRemaining = true;
      }
    }
    if (node != null && !isNotRemaining) {
      matchList.push([childNode, matches]);
    }
  }
  function depthFirstSearch(node, expression, nonGlobalRegex, matchList) {
    const stack = [node];
    const visited = /* @__PURE__ */ new Set();
    while (stack.length) {
      const vertex = stack.pop();
      if (!visited.has(vertex)) {
        visited.add(vertex);
        const directlyContainedText = getDirectlyContainedText(vertex);
        if (nonGlobalRegex.test(directlyContainedText) && vertex.tagName != "SCRIPT" && vertex.tagName != "STYLE") {
          if (vertex.previousSibling != null) {
            const prevSiblingText = getDirectlyContainedText(vertex.previousSibling);
            if (nonGlobalRegex.test(directlyContainedText + prevSiblingText) && prevSiblingText != "" && prevSiblingText != " ") {
              matchList.push([vertex, (prevSiblingText + directlyContainedText).match(expression), directlyContainedText]);
            }
          } else {
            matchList.push([vertex, directlyContainedText.match(expression)]);
          }
        }
        stack.push(...vertex.children);
      }
    }
  }
  function updateMatches(matchList, unitFindRegex, measureType, languageInfo) {
    for (const [node, matches, splitNodeText] of matchList) {
      for (let match of matches) {
        match = match.match(unitFindRegex);
        if (match[2]) {
          let numericNode = node;
          let unitNode = node;
          let numericPart = match[2];
          const unitPart = match[4];
          const contextPart = match[5];
          if (/^[A-RT-Za-rt-z]/.test(contextPart)) {
            continue;
          }
          for (const child of node.children) {
            if (child.textContent?.includes(unitPart) && unitNode == node) {
              unitNode = child;
            }
          }
          for (const child of node.children) {
            if (child.textContent?.includes(numericPart.replace(" ", "")) && numericNode == node) {
              numericNode = child;
            } else if (numericNode != node && child.nextElementSibling == unitNode) {
              numericNode = child;
            }
          }
          if (numericNode.tagName == "SCRIPT" || numericNode.tagName == "STYLE" || unitNode.tagName == "SCRIPT" || unitNode.tagName == "STYLE") {
            continue;
          }
          var isSlashFractionMatched = false;
          var convertedQuantity = 0;
          if (numericPart.includes("and")) {
            convertedQuantity += parseFloat(numericPart);
            numericPart.replace(numericPart + " and ", "");
          }
          if (slashFractionMatcherRegex.test(numericPart)) {
            isSlashFractionMatched = true;
            const slashFractionMatch = numericPart.match(slashFractionMatcherRegex);
            convertedQuantity += parseFloat(slashFractionMatch[1]);
            convertedQuantity += parseFloat(slashFractionMatch[2].split("/")[0]) / parseFloat(slashFractionMatch[2].split("/")[1]);
          } else if (numericPart.includes("/")) {
            convertedQuantity += parseFloat(numericPart.split("/")[0]) / parseFloat(numericPart.split("/")[1]);
          } else if (fractionMatcherRegex.test(numericPart)) {
            const fractionMatch = numericPart.match(fractionMatcherRegex);
            const fractionalQuantity = commonUnicodeFractions[fractionMatch[2]];
            convertedQuantity += parseInt(fractionMatch[1]) + parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]);
          } else if (singularFractionRegex.test(numericPart)) {
            const fractionMatch = numericPart.match(singularFractionRegex);
            const fractionalQuantity = commonUnicodeFractions[fractionMatch[0]];
            convertedQuantity += parseFloat(fractionalQuantity.split("/")[0]) / parseFloat(fractionalQuantity.split("/")[1]);
          } else {
            convertedQuantity += parseFloat(numericPart.replace(",", "."));
          }
          if (!isSlashFractionMatched) {
            numericPart = numericPart.replaceAll(" ", "");
          }
          if (measureType != "temperature") {
            var unitFound = false;
            conversions2[measureType][languageInfo.from].forEach((unit) => {
              if (unitPart.toLowerCase().replace(" ", "") == unit["name"] | unit.abbr.includes(unitPart.toLowerCase()) && !unitFound) {
                unitFound = true;
                convertedQuantity = convertedQuantity * unit.standard;
              }
            });
            if (!unitFound) {
              console.log("unit not found");
              debugger;
              continue;
            }
          }
          var numericString;
          var unitString;
          if (measureType === "temperature") {
            numericString = parseInt(conversions2[measureType][languageInfo.to][0]["conversionFunction"](convertedQuantity));
            unitString = conversions2[measureType][languageInfo.to][0]["name"];
          } else {
            const unitList = conversions2[measureType].shared ? conversions2[measureType][languageInfo.to].concat(conversions2[measureType].shared) : conversions2[measureType][languageInfo.to];
            const result = calculateUnitString(convertedQuantity, unitList, decimalToFractionLookup);
            numericString = result[0];
            unitString = result[1];
          }
          if (splitNodeText) {
            node.previousSibling.textContent = numericString;
            node.innerHTML = node.innerHTML.replaceAll(splitNodeText, unitString);
          } else if (numericNode == unitNode) {
            const newString = match[1] + numericString + " " + unitString + contextPart;
            node.innerText = node.innerText.replaceAll(match[0], newString);
          } else {
            unitNode.textContent = unitNode.textContent.replaceAll(unitPart, unitString);
            if (isSlashFractionMatched) {
              numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString);
            } else {
              numericNode.innerHTML = numericNode.innerHTML.replaceAll(numericPart, numericString + " ");
            }
          }
        }
      }
    }
    return document.body.innerHTML;
  }
  async function main(rootNode, reciveData) {
    var data = await reciveData;
    if (Object.keys(data).length === 0) {
      data = defaultConfig;
    } else {
      data = data.data;
    }
    for (const measurments of Object.keys(conversions2)) {
      var matchList = [];
      const globalExpression = conversions2[measurments]["regex"][data.from][0];
      const nonGlobalExpression = conversions2[measurments]["regex"][data.from][1];
      if (!globalExpression.test(rootNode.textContent)) {
        continue;
      }
      depthFirstSearch(rootNode, globalExpression, nonGlobalExpression, matchList);
      updateMatches(matchList, nonGlobalExpression, measurments, data);
      matchList = [];
      searchForSplitNodes(rootNode, null, null, globalExpression, nonGlobalExpression, matchList);
      updateMatches(matchList, nonGlobalExpression, measurments, data);
    }
  }
  if (typeof process === "undefined") {
    if (typeof browser === "undefined") {
      chrome.storage.onChanged.addListener(() => location.reload());
    } else {
      browser.storage.onChanged.addListener(() => location.reload());
    }
    main(document.body, getStorageData("data"));
  }
})();
