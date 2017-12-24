let video = null;

/**
 * www.youtube.com is SPA.
 * If landing page is https://www.youtube.com/ and doesn't load this script, this script will not get loaded even if move to video page.
 * So https://www.youtube.com/ page load it.
 * And https://www.youtube.com/ inject video tag after finish loading with delay.
 * So try to init until succeed.
 */
initUntilDone();

function initUntilDone() {
    if (!init()) {
        setTimeout(initUntilDone, 1000);
    }
}

function init() {
    video = document.querySelector("video");
    if (video == null) return false;

    // to call frontend functions from background.js
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            return window[request.action](request.args, sender, sendResponse);
        }
    );

    // when video get played, register the tab and update icon
    video.addEventListener("playing", function () {
        chrome.runtime.sendMessage({
            action: "play",
            args: null
        });
    });

    // when video paused, update icon
    video.addEventListener("pause", callBackgroundPause);

    return true;
}


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
