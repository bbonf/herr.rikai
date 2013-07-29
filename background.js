function load_herr(tab) {
	chrome.tabs.sendMessage(tab.id, {"action":"load"});
}

chrome.browserAction.onClicked.addListener(load_herr);