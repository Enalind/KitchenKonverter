// Default configuration values
var defaultConfig = {
    "from": "us",
    "to": "metric",
    "type": "update"
}

// DOM elements representing various UI components
const fromCheckboxElement = document.querySelector("#from-checkbox");
const toCheckboxElement = document.querySelector("#to-checkbox");
const commitButton = document.querySelector("#commit-button");
const fromPortionElement = document.querySelector("#from-portion");
const toPortionElement = document.querySelector("#to-portion");

const errorCatchingMessagePromise = (tab, message) => new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        } else {
            resolve(chrome.tabs.update(tab.id, {url: tab.url}));
        }
    });
})

async function sendMessageToActiveTab(message) {
    const tabs = await chrome.tabs.query({});
    const responses = await Promise.all(tabs.map(tab => {
        return errorCatchingMessagePromise(tab, message).catch(e => console.log(`failed to send to tab with id ${tab.id} error: ${e.message}`))
    }));
  }

// Async function to load default settings and update UI elements
async function loadDefaults(event) {
    // Initialize settings with default configuration
    let settings = defaultConfig;

    // Check if the "browser" object is defined for cross-browser compatibility
    if (typeof browser === "undefined") {
        var browser = chrome;
    }

    // Retrieve data from browser storage and set it as "data"
    const data = (await browser.storage.sync.get("data")).data;

    // Check if "data" is not an empty object
    if (data != undefined) {
        settings = data;
    }

    // Determine the state of "from" and "to" checkboxes based on settings
    const fromMetric = settings.from === "metric";
    const toMetric = settings.to === "metric";

    // Update the state of the "from" and "to" checkboxes in the UI
    fromCheckboxElement.checked = fromMetric; // Assuming "fromCheckboxElement" is defined
    toCheckboxElement.checked = toMetric; // Assuming "toCheckboxElement" is defined
}


// Async function to save user-selected defaults
async function saveDefaults(event) {
    // Create a submission object to store user-selected settings
    var submission = {
        "from": fromCheckboxElement.checked ? "metric" : "us",
        "to": toCheckboxElement.checked ? "metric" : "us"
    };


    // Store the submission object in Chrome storage under the "data" key
    chrome.storage.sync.set({"data": submission});

    // Update the default configuration with the user-submitted values
    defaultConfig = submission;
}

loadDefaults()

commitButton.addEventListener("click", saveDefaults)
