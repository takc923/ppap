let video = new NullVideo(null);

/**
 * I monitor video tag every second. This is because of 2 reasons, (a) and (b) below.
 *
 * (a) For youtube
 * www.youtube.com is SPA.
 * If landing page is https://www.youtube.com/ and doesn't load this script, this script will not get loaded even if move to video page.
 * So https://www.youtube.com/ page load it.
 * And https://www.youtube.com/ inject video tag after finish loading with delay.
 *
 * (b) For nicovideo
 * A video dom at page loaded time in nicovideo will be replaced with new one.
 * So the way that get video dom only at loaded time does not work.
 */

// to call frontend functions from background.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    return window[request.action](request.args, sender, sendResponse);
  }
);

setInterval(monitor, 1000);

function monitor() {
  if (video.isActive()) return;
  ppapLog("monitor: video is not active");

  video = Video.create(location.host);
  if (!video.isActive()) return;

  ppapLog("monitor: detected new video.");
  updateLatestState();
}

function callBackgroundPlay() {
  chrome.runtime.sendMessage({
    action: "play",
    args: null
  });
}

function callBackgroundPause() {
  chrome.runtime.sendMessage({
    action: "pause",
    args: null
  });
}

function updateLatestState() {
  if (video.isPaused()) {
    callBackgroundPause();
  } else {
    callBackgroundPlay();
  }
}

//for onMessage callback functions
function toggle(args, sender, sendResponse) {
  ppapLog("toggle");
  video.toggle();
}
