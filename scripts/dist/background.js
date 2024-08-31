if(chrome == "undefined"){
    browser.runtime.setUninstallURL("https://kitchenkonverter.com/uninstalled")
    browser.runtime.onInstalled.addListener((obj) => {
        if(obj.reason == "install"){
            browser.tabs.create({
                url: "https://kitchenkonverter.com/installed",
                active: true
            })
        }
    })
}
else{
    chrome.runtime.setUninstallURL("https://kitchenkonverter.com/uninstalled")
    chrome.runtime.onInstalled.addListener((obj) => {
        if(obj.reason == "install"){
            chrome.tabs.create({
                url: "https://kitchenkonverter.com/installed",
                active: true
            })
        }
    })
}