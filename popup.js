/*
This area is for users to declare what filters they want to apply to their job searches
*/
let extensionHtml = document.getElementById("extension-popup");
let filters = {}

function setupExtension() {
    extensionHtml.innerHTML = `
        <h1 class="extension-title">Linkedin Jobs Blacklist</h1>
        <div class="filter-content">
            <div class="filter-checkbox">
                <input type="checkbox" id="repostedJobs" name="repostedJobs" />
                <label for="repostedJobs" unselectable>Reposted Jobs</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="viewedJobs" name="viewedJobs" />
                <label for="viewedJobs">Viewed Jobs</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="JobTitle" name="JobTitle" />
                <label for="JobTitle">Job Title</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="companyNames" name="companyNames" />
                <label for="companyNames">Company Names</label>
            </div>
        </div>
        <div class="filter-list">
            <button class="filter-list-section">Job Titles</button>
            <button class="filter-list-section">Companies</button>
        </div>
        <button class="apply-changes">Save Changes</button>
    `;

    document.getElementsByClassName("filter-list-section")[0].addEventListener('click', () => filterList("Job Titles"));
    document.getElementsByClassName("filter-list-section")[1].addEventListener('click', () => filterList("Company Names"));
    document.getElementsByClassName("apply-changes")[0].addEventListener('click', saveChecklist);
}

function filterList(filterType) {
    document.getElementsByClassName("filter-list-section")[0].removeEventListener('click', () => filterList("Job Titles"));
    document.getElementsByClassName("filter-list-section")[1].removeEventListener('click', () => filterList("Company Names"));
    document.getElementsByClassName("apply-changes")[0].removeEventListener('click', saveChecklist);

    extensionHtml.innerHTML = `
        <h1 class="extension-title">Linkedin Jobs Blacklist</h1>
        <textarea placeholder="Enter the words or phrases you want to exclude from ${filterType}, one per line."></textarea>
        <button class="apply-changes">Cancel</button>
        <button class="apply-changes">Save Changes</button>
    `;

    document.getElementsByClassName("apply-changes")[0].addEventListener('click', () => backToHomepage(null));
    document.getElementsByClassName("apply-changes")[1].addEventListener('click', () => backToHomepage("save changes"));
}

function backToHomepage(action) {
    document.getElementsByClassName("apply-changes")[0].removeEventListener('click', () => backToHomepage(null))
    document.getElementsByClassName("apply-changes")[1].removeEventListener('click', () => backToHomepage("save changes"))

    if (action == "save changes") {
        // save to chrome storage
        // change filters
    }

    setupExtension();
}

function saveChecklist() {
    // get checklist, save values into local storage 
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.session.get("linkedInFilters", function(data) {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving data from storage:", chrome.runtime.lastError);
        } else {
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
