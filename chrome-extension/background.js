chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });
  console.log("The color is green.");
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  // chrome.browserAction.onClicked.addListener(function(tab) {
  //   var action_url = "http://www.reddit.com/submit?url=" + encodeURIComponent(tab.href) + '&title=' + encodeURIComponent(tab.title);
  //   chrome.tabs.create({ url: action_url });
  // });
  setTimeout( () => {
    chrome.runtime.onMessage.addListener(function(request, sender) {
      console.log("request is: ", request)
      console.log("Sender is: ", sender)
      console.log("Sender.tab is: ", sender.tab)
      // chrome.tabs.update(sender.tab.id, {url: request.redirect});
      chrome.tabs.create({'url': "chrome://newtab"})
    });
    console.log("The color is blue.");
  }, 1000)
});