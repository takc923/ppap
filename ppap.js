let video = document.querySelector("video");

// to call frontend functions from background.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

// when video get played, register the tab and update icon
video.addEventListener("playing", function () {
    chrome.runtime.sendMessage({
        action : "play",
        args: null
    });
});

// when video paused, update icon
video.addEventListener("pause", callBackgroundPause);
function callBackgroundPause() {
    chrome.runtime.sendMessage({
        action: "pause",
        args: null
    });
}

//for onMessage callback functions
function toggle(args, sender, sendResponse) {
    if (isPaused()) video.play();
    else video.pause();
}

// utilities
function isPaused() {
    return video.paused || video.ended;
}
