var defaults = {
    "from": "us",
    "to": "metric",
    "type": "update"
}

const fromCheckbox = document.querySelector("#from")
const toCheckbox = document.querySelector("#to")
const commit = document.querySelector("#commit")
const fromPortion = document.querySelector("#from-portion")
const toPortion = document.querySelector("#to-portion")
chrome.storage.onChanged.addListener(function(changes, namespace) { 
    console.log(changes)
})

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
    console.log(responses);
    // TODO: Do something with the response.
  }

async function loadDefaults(e){
    let settings = defaults
    if (typeof browser === "undefined") {
        var browser = chrome;
    }
    const data = (await browser.storage.sync.get("data")).data
    if(data != {}){
        settings = data
    }
    const from = data.from == "metric"
    const to = data.to == "metric"
    if(data.toPortion){
        const toPortionData = data.toPortion
        toPortion.value = toPortionData
    }
    
    fromCheckbox.checked = from
    toCheckbox.checked = to
}


async function saveDefaults(e){
    var submission = {
        "from": fromCheckbox.checked ? "metric" : "us",
        "to": toCheckbox.checked ?"metric": "us"
    }
    if(fromPortion.value && toPortion.value){
        submission["factor"] = (parseInt(toPortion.value)/parseInt(fromPortion.value)).toFixed(1)
        submission["toPortion"] = parseInt(toPortion.value)
    }
    chrome.storage.sync.set({"data": submission})
    defaults = submission
}

async function flipDefaults(e){
    console.log(await chrome.storage.sync.get("data"))
    
    if (typeof browser === "undefined") {
        var browser = chrome;
    }
    var data = {}
    data.from = defaults.from == "us" ? "metric" : "us"
    data.to = defaults.to == "metric" ? "us" : "metric"
    data.type = "update"
    console.log(data)
    defaults = data
    await sendMessageToActiveTab(data)

}
loadDefaults()

commit.addEventListener("click", saveDefaults)
