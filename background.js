// todo 名前
// todo niconico以外対応
// todo アイコン変更

const iconPathNowPlaying = "icon/pause.png"; // button click means pause when playing
const iconPathNowPaused = "icon/play_black.png"; // button click means play when paused
let targetTabId;

// when a target tab get closed or move to other page, unregister the tab.
chrome.tabs.onRemoved.addListener(function (removedTabId, removeInfo) {
    if (removedTabId === targetTabId) unregister();
});
chrome.tabs.onUpdated.addListener(function(updatedTabId, changeInfo) {
    if (changeInfo.status == 'loading'
        && updatedTabId === targetTabId){
        unregister();
    }
});
function unregister(dummy, sender) {
    targetTabId = null;
    chrome.browserAction.setIcon({path: "icon/icon.png"});
    chrome.browserAction.setTitle({title: "niconicoamp"});
}

// play or pause if you click icon or fire shortcut key
chrome.browserAction.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener(toggle);
function toggle() {
    if (!targetTabId) return;

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
    targetTabId = sender.tab.id;
    chrome.browserAction.setIcon({path: iconPathNowPlaying});
    chrome.browserAction.setTitle({title: sender.tab.title});
}

function pause(args, sender) {
    if (targetTabId === sender.tab.id) {
        chrome.browserAction.setIcon({path: iconPathNowPaused});
    }
}
