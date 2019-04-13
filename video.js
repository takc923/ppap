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

  toggle() {
  }

  isActive() {
    return this.underlying.offsetParent != null;
  }

  static create(host) {
    let v = document.querySelector("video");
    if (v == null) return new NullVideo(null);
    switch (host) {
      case "www.youtube.com":
        return new Youtube(v);
      case "www.nicovideo.jp":
        return new NicoVideo(v);
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
      ppapLog("nicovideo: play");
      this.underlying.play();
    } else {
      ppapLog("nicovideo: pause");
      this.underlying.pause();
    }
  }
}

class Youtube extends Video {
  toggle() {
    ppapLog("youtube: click");
    this.underlying.click();
  }
}
