// ==UserScript==
// @name     Youtube Ad Silencer
// @version  0.1
// @grant    none
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/*
// @match https://s.ytimg.com/yts/jsbin/*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @match https://m.youtube.com/watch*
// ==/UserScript==

(function () {

  var observer = null;
  var isMuted = false;
  var adFlag = false;

  function setObserver(selector) {
    if (observer != null) {
      observer.disconnect();
      observer = null;
    }

    var node = document.querySelector(selector);
    if (node == null) {
      console.log("selector not found");
      return;
    }
    observer = new MutationObserver(callback);
    observer.observe(node, { attributes: true, childList: true, subtree: true });
  }

  function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  const callback = function (records, observer) {
    console.log("body has changed");
    adFlag = false;

    element = getElementByXpath('//div[@class="ytp-ad-player-overlay-skip-or-preview"]');
    if (element) {
      adFlag = true;
      console.log("found: ytp-ad-player-overlay-skip-or-preview");
    }

    element = getElementByXpath('//button[@class="ytp-ad-overlay-close-button"]')
    if (element) {
      console.log("Closing overlay ad");
      element.click();
    }

    element = getElementByXpath('//div[@class="ytp-ad-text ytp-ad-skip-button-text"]');
    if (element) {
      adFlag = true;
      console.log("Found: " + (element.textContent ? element.textContent : element.innerText));
      if (element.offsetParent === null) {
        console.log("Waiting to skip video ad");
      } else {
        adFlag = false;
        console.log("Skipping video ad");
        element.click();
      }
    }

    element = getElementByXpath('//div[@class="video-ads ytp-ad-module"]');
    if (element) {
      console.log("found: video-ads ytp-ad-module");

    
      if (adFlag == true && isMuted == false) {
        if (getElementByXpath("//button[@class='ytp-mute-button ytp-button']/*[local-name()='svg']/*[local-name()='path' and @class='ytp-svg-fill ytp-svg-volume-animation-speaker']"))
          isMuted = false;
        else
          isMuted = true;
      }

      /*
      if (adFlag == true) {
          console.log("Disable Sound");
          const elems = document.querySelectorAll("video, audio");
          for (const el of elems) {
            el.muted = true;
          }        
      } else {
          console.log("Enable Sound");        
          const elems = document.querySelectorAll("video, audio");
          for (const el of elems) {
            el.muted = false;
          }        
      }
      */
      
      var muteElement = getElementByXpath('//button[@class="ytp-mute-button ytp-button"]');
      if (adFlag == true) {
        if (muteElement && isMuted == false) {
          isMuted = true;
          muteElement.click();
          console.log("Disable Sound");
          //const elems = document.querySelectorAll("video, audio");
          //for (const el of elems) {
          //  el.muted = true
          //}
          
        }
      } else {
        if (muteElement && isMuted == true) {
          muteElement.click();
          isMuted = false;
          console.log("Enable Sound");
        }
      }
      
    }

    if (element) {
      console.log("Set Observer");
      setObserver('div[class="video-ads ytp-ad-module"]');
    }
  };

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  setObserver('body');
  return;

})();
