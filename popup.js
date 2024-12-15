/*
This area is for users to declare what filters they want to apply to their job searches
*/
let extensionHtml = document.getElementById("extension-popup");
let filters = {}
let filterType = null;

function setupExtension() {
    extensionHtml.innerHTML = `
        <h1 class="extension-title">Linkedin Jobs Blacklist</h1>
        <div class="filter-content">
            <div class="filter-checkbox">
                <input type="checkbox" id="repostedJobs" name="repostedJobs" ${filters.reposted == true ? 'checked' : ''}/>
                <label for="repostedJobs" unselectable>Reposted Jobs</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="viewedJobs" name="viewedJobs" ${filters.viewed == true ? 'checked' : ''}/>
                <label for="viewedJobs">Viewed Jobs</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="jobTitle" name="jobTitle" ${filters.jobTitles == true ? 'checked' : ''}/>
                <label for="jobTitle">Job Title</label>
            </div>
            <div class="filter-checkbox">
                <input type="checkbox" id="companyNames" name="companyNames" ${filters.companyNames == true ? 'checked' : ''}/>
                <label for="companyNames">Company Names</label>
            </div>
        </div>
        <div class="filter-list">
            <button class="filter-list-section">Job Titles</button>
            <button class="filter-list-section">Companies</button>
        </div>
        <button class="apply-changes">Save Changes</button>
    `;

    document.getElementsByClassName("filter-list-section")[0].addEventListener('click', filterJobTitles);
    document.getElementsByClassName("filter-list-section")[1].addEventListener('click', filterCompanyNames);
    document.getElementsByClassName("apply-changes")[0].addEventListener('click', saveChecklist);
}

function filterList() {
    document.getElementsByClassName("filter-list-section")[0].removeEventListener('click', filterJobTitles);
    document.getElementsByClassName("filter-list-section")[1].removeEventListener('click', filterCompanyNames);
    document.getElementsByClassName("apply-changes")[0].removeEventListener('click', saveChecklist);
    extensionHtml.innerHTML = `
        <h1 class="extension-title">Linkedin Jobs Blacklist</h1>
        <textarea class="list-of-filters" placeholder="Enter the words or phrases you want to exclude from ${filterType}, one per line. ${filterType == 'job titles' ? 'Job titles filter out jobs with matching keywords.' : 'Company names must exactly match the company you want to block.'}">${filterType == 'job titles' ? Array.from(filters.jobTitleFiltersList).join('\n') : Array.from(filters.companyFiltersList).join('\n')}</textarea>
        <button class="apply-changes">Cancel</button>
        <button class="apply-changes">Save Changes</button>
    `;

    document.getElementsByClassName("apply-changes")[0].addEventListener('click', back);
    document.getElementsByClassName("apply-changes")[1].addEventListener('click', backAndSave);
}

function backToHomepage(action) {
    document.getElementsByClassName("apply-changes")[0].removeEventListener('click', back);
    document.getElementsByClassName("apply-changes")[1].removeEventListener('click', backAndSave);

    if (action == "save changes") {
        let textFilter = document.getElementsByClassName("list-of-filters")[0].value;
        let listFilters = textFilter.split('\n');
        console.log(listFilters);
        console.log(filterType);
        if (filterType == "job titles") {
            filters.jobTitleFiltersList = listFilters;
        }

        if (filterType == "company names") {
            filters.companyFiltersList = listFilters;
        }

        console.log(filters);
        chrome.storage.local.set({"linkedInFilters": filters}, () => {
            console.log("Filters saved to chrome.storage:", filters);
        });
    }

    setupExtension();
}

function saveChecklist() {
    // get checklist, save values into local storage 
    let inputs = document.getElementsByTagName('input');
    console.log(inputs);
    for (let i = 0; i < inputs.length; i++) {
        console.log(inputs[i].checked);
        let typeOfFilter = inputs[i].name;
        
        switch (typeOfFilter) {
            case "repostedJobs":
                filters.reposted = inputs[i].checked;
                break;
            case "viewedJobs":
                filters.viewed = inputs[i].checked;
                break;
            case "jobTitle":
                filters.jobTitles = inputs[i].checked;
                break;
            case "companyNames":
                filters.companyNames = inputs[i].checked;
                break
        }
    }

    console.log(filters);
    chrome.storage.local.set({"linkedInFilters": filters}, () => {
        console.log("Filters saved to chrome.storage:", filters);
    });
}

function filterJobTitles() {
    filterType = "job titles"
    filterList();
}

function filterCompanyNames() {
    filterType = "company names"
    filterList();
}

function backAndSave() {
    backToHomepage("save changes");
    filterType = null;
}

function back() {
    backToHomepage(null);
    filterType = null;
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("linkedInFilters", function(data) {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving data from storage:", chrome.runtime.lastError);
        } else {
            // Check if the key exists in the retrieved data
            if (data["linkedInFilters"] === undefined) {
              filters = {
                reposted: false,
                viewed: false,
                jobTitles: false,
                companyNames: false,
                jobTitleFiltersList: [],
                companyFiltersList: []
              }
            } else {
                filters = data["linkedInFilters"]
            } 
            console.log(filters);
            setupExtension(filters)
        }
    });    
});
