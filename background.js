chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    code: "var e = document.createElement('script');e.src = chrome.extension.getURL('inject.js');document.body.appendChild(e);"
  });
},
{
  urls: [
    "http://*.userapi.com/js/al/places.js*"
  ],
  types: ["script"]
});