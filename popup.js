/*
This area is for users to declare what filters they want to apply to their job searches
*/
/*
function setupExtension(filters) {
    let extensionHtml = document.getElementById("extension-popup");
    extensionHtml.innerHTML = `

    `;
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.session.get("linkedInFilters", function(data) {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving data from storage:", chrome.runtime.lastError);
        } else {
            let filters = {}
            // Check if the key exists in the retrieved data
            if (data["linkedInFilters"] === undefined) {
              filters = {
                reposted: false,
                viewed: false,
                jobTitleFilters: new Set(),
                companyFilters: new Set()
              }
            } else {
                filters = data["linkedInFilters"]
            } 

            setupExtension(filters)
        }
    });    
});
*/