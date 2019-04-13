
class Video {
  constructor(underlying) {
    if (underlying == null) return;
    // when video get played, register the tab and update icon
    underlying.addEventListener("playing", callBackgroundPlay);

    // when video paused, update icon
    underlying.addEventListener("pause", callBackgroundPause);

    this.underlying = underlying;
  }
  isPaused() {
    return this.underlying.paused || this.underlying.ended;
  }
  toggle() {}
  isActive() {
    return this.underlying.offsetParent != null;
  }

  static create(host) {
    let v = document.querySelector("video");
    if (v == null) return new NullVideo(null);
    switch (host) {
      case "www.youtube.com": return new Youtube(v);
      case "www.nicovideo.jp": return new NicoVideo(v);
    }
    return new NullVideo(null);
  }
}

class NullVideo extends Video {
  isPaused() {
    return true;
  }
  isActive() {
    return false;
  }
}

class NicoVideo extends Video {
  toggle() {
    if (this.isPaused()) {
      console.log("video.play");
      this.underlying.play();
    } else {
      console.log("video.pause");
      this.underlying.pause();
    }
  }
}

class Youtube extends Video {
  toggle() {
    console.log("video.click");
    this.underlying.click();
  }
}

let video = new NullVideo(null);

/**
 * www.youtube.com is SPA.
 * If landing page is https://www.youtube.com/ and doesn't load this script, this script will not get loaded even if move to video page.
 * So https://www.youtube.com/ page load it.
 * And https://www.youtube.com/ inject video tag after finish loading with delay.
 * So try to init until succeed.
 */

// to call frontend functions from background.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      return window[request.action](request.args, sender, sendResponse);
  }
);

setInterval(init, 1000);

function init() {
    if (video.isActive()) return false;

    video = Video.create(location.host);
    if (!video.isActive()) return false;

    updateLatestState();

    return true;
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
    console.log("toggle");
    video.toggle();
}
