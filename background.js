// Since websites use SPA, content script won't load even when link changes
// this code is used to detect url changes that match the deciphering we want
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // checks if the page is valid 
    // if it is we send a msg to content script to start filtering page
    console.log(changeInfo);
    console.log(tabId);
    console.log(tab);

    if (changeInfo.status === 'complete' && matchesUrlRegex(tab.url)) {
        console.log("valid page for filtering", tabId);
        chrome.tabs.sendMessage( tabId, {
            action: "filterPage"
        })
    }
});

function matchesUrlRegex(tabURL) {
    console.log("parsing regex");
    console.log(tabURL);
    const pattern = "http://127.0.0.1:5500/*";
    // const pattern = "https://www.linkedin.com/jobs/search/*";
    const regexPattern = new RegExp("^" + pattern.replace(/\*/g, '.*') + "$");
    console.log(regexPattern.test(tabURL));
    return regexPattern.test(tabURL);
}

// Listen for completed requests to inspect the response (if applicable)
chrome.webRequest.onCompleted.addListener(
    (details) => {
      if (details.url.includes("voyagerJobsDashJobCards")) {
        console.log("Completed request for:", details.url);
  
        // Inspect response details (but note that you can't directly access the body)
        console.log("Response Status:", details.statusCode);
      }
    },
    { urls: ["https://*/*"] }  // Match all URLs or specify the domain if needed
  );