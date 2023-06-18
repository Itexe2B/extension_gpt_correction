chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "reformulate",
        "title": "Reformuler",
        "contexts": ["selection"]
    });
    chrome.contextMenus.create({
        "id": "correction",
        "title": "Corriger",
        "contexts": ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "reformulate") {
        chrome.tabs.sendMessage(tab.id, {text: 'reformulate', data: info.selectionText});
    }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "correction") {
        chrome.tabs.sendMessage(tab.id, {text: 'correction', data: info.selectionText});
    }
});


