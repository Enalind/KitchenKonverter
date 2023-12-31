function celsiusToFarenheit(celsius){
    return (celsius * 1.8 + 32).toFixed(0)
}
function farenheitToCelsius(farenheit){
    return (0.55 * (farenheit - 32)).toFixed(0)
}
export const defaultConfig = {
    "from": "us",
    "to": "metric"
}


export const commonUnicodeFractions = {
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
}
export const slashFractionMatcherRegex = /([0-9])+\s([0-9]\/[0-9])/
export const fractionMatcherRegex = /([0-9])+([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/
export const singularFractionRegex = /([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/
export const conversions = {
    "volume": {
        "regex": {
            "us": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt\.|gallon|gal)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(fluid ounce|fl oz|fl. oz|cup|cup|quart|qt\.|gallon|gal)/i],
            "metric": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(milliliter|ml|centiliter|cl|deciliter|dl|liter|l)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(milliliter|ml|centiliter|cl|deciliter|dl|liter|l)/i]
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
                    "qt\.",
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
        "regex": {
            "us": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(ounce|oz|pound|lb)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(ounce|oz|pound|lb)/i],
            "metric": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(gram|g|kilogram|kg)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(gram|g|kilogram|kg)/i]
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
                "standard": 1000
            }
        ]
    },
    "temperature": {
        "regex": {
            "us": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(farenheit|f|°f)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(farenheit|f|°f)/i],
            "metric": [/(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(celsius|c|centigrade|°c)/gi, /(([0-9/½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)(?:\sand\s)*\s?(?:[0-9/\.\,]*))\s?(celsius|c|centigrade|°c)/i]
        },
        "us": [
            {
                "name": "farenheit",
                "abbr": [
                    "°F",
                    "f"
                ],
                "conversionFunction": celsiusToFarenheit
            }
        ],
        "metric": [
            {
                "name": "celsius",
                "abbr": [
                    "°C",
                    "c",
                    "centigrade"
                ],
                "conversionFunction": farenheitToCelsius
            }
        ]
    }
  }
export const defaults = {
    "from": "metric",
    "to": "us"
}
export const decimalToFractionLookup = {
    0.1 : "1/10",
    0.2 : "1/5",
    0.3 : "1/3",
    0.4 : "2/5",
    0.5 : "1/2",
    0.6 : "3/5",
    0.7: "2/3",
    0.8 : "3/4",
    0.9 : "9/10" 
}