// todo アイコン変更

const iconPathNowPlaying = "icon/pause.png"; // button click means pause when playing
const iconPathNowPaused = "icon/play_black.png"; // button click means play when paused
let targetTabId;

// when a target tab get closed or move to other page, unregister the tab.
chrome.tabs.onRemoved.addListener(function (removedTabId, removeInfo) {
    if (removedTabId === targetTabId) unregister();
});
chrome.tabs.onUpdated.addListener(function(updatedTabId, changeInfo) {
    if (changeInfo.status === 'loading'
        && updatedTabId === targetTabId){
        ppapLog("tab updated. call unregister()");
        unregister();
        chrome.tabs.sendMessage(updatedTabId, { action: "updateLatestState" });
    }
});
function unregister(dummy, sender) {
    targetTabId = null;
    chrome.browserAction.setIcon({path: "icon/icon.png"});
    chrome.browserAction.setTitle({title: "PlainPauseAndPlay"});
}

// play or pause if you click icon or fire shortcut key
chrome.browserAction.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener(toggle);
function toggle() {
    if (!targetTabId) return;

    ppapLog("toggle");
    chrome.tabs.sendMessage(
        targetTabId,
        { action: "toggle" },
        null
    );
}

// to call background.js functions from frontend
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

// for onMessage callback functions
function play(args, sender){
    ppapLog("play");
    targetTabId = sender.tab.id;
    chrome.browserAction.setIcon({path: iconPathNowPlaying});
    chrome.browserAction.setTitle({title: sender.tab.title});
}

function pause(args, sender) {
    ppapLog("pause");
    targetTabId = sender.tab.id;
    chrome.browserAction.setIcon({path: iconPathNowPaused});
    chrome.browserAction.setTitle({title: sender.tab.title});
}
