/*
Core Goals:
 - option to block reposted jobs (check mark)
 - option to block jobs already viewed (check mark)
 - option to block job titles containing certain keywords (list style in textbox)
 - option to block job postings from certain companies (list style in textbox)

Nice to haves:
 - stats to see # of jobs blocked and what filters they match
 - ability to see what jobs have been blocked on a page view 

How the extension will work:
 1. on matching page, list of filters and reposted job id's will be retrieved from local storage
 2. elements that match the filter will be blocked 
 3. when service worker intercepts voyagerJobsDashJobCards, will send a msg
    to contentScript to remove reposted jobs
 4. service worker will save reposted jobs to sessionStorage since, linkedin 
    is likely to retrieve reposted job status for next page too 
*/

// strong tag     job title identifier 
// boAvmrAFfwZEHebYjctgTppwiEwazqIftEMU            company class identifier 
// job-card-container__footer-item job-card-container__footer-job-state t-bold      viewed job class identifier 
console.log("hello");
// Linkedin is SPA so content script would not be able to detect when a job query page is loaded
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (message.action === 'filterPage') {
       const title = document.title;
       console.log(window.location.href);
      filterVisiblePage()
   }
});

function filterVisiblePage() {
   filters = filters = {
      reposted: false,
      viewed: false,
      jobTitles: false,
      companyNames: false,
      jobTitleFiltersList: [],
      companyFiltersList: {}
   }

   chrome.storage.local.get("linkedInFilters", function(data) {
      if (chrome.runtime.lastError) {
          console.error("Error retrieving data from storage:", chrome.runtime.lastError);
      } else {
         // Check if the key exists in the retrieved data
         if (data["linkedInFilters"] != undefined) {
            filters = data["linkedInFilters"];
            filters["companyFiltersList"] = new Set(filters["companyFiltersList"]);
         }
         
         removeVisibleJobs(filters);
      }
  });
} 

function removeVisibleJobs(filters) {
   console.log(filters);
   // jobs are displayed using li 
   let jobs = document.getElementsByClassName("grgNrGjNrPlqhrUKNoLxOvXUjtzhHtSTQ");

   for (let i = jobs.length-1; i >= 0; i--) {
      jobTitleInFilter = false;
      viewedJob = false;
      companyNameInFilter = false;

      if (filters.companyNames) {
         let companyName = jobs[i].getElementsByClassName('boAvmrAFfwZEHebYjctgTppwiEwazqIftEMU')[0].textContent.trim().split(" ·")[0];
         console.log(companyName);
         if (filters.companyFiltersList.has(companyName)) {
            companyNameInFilter = true;
         }
      }

      if (filters.viewed) {
         let viewStatus = jobs[i].getElementsByClassName("job-card-container__footer-job-state")[0];
         if (filters.viewed && viewStatus != undefined) {
            viewedJob = true;
         }
      }

      if (filters.jobTitles) {
         let jobTitle = jobs[i].querySelector("strong").textContent.toLowerCase();
         if (filters.jobTitles) {
            for (let a = 0; a < filters.jobTitleFiltersList.length; a++) {
               if (filters.jobTitleFiltersList[a] != '' && jobTitle.includes(filters.jobTitleFiltersList[a].toLowerCase())) {
                  jobTitleInFilter = true;
                  break;
               }
            }
         }
      }
      // viewedJob
      // companyNameInFilter
      // jobTitleInFilter
      if (companyNameInFilter || viewedJob || jobTitleInFilter) {
         jobs[i].style.color = 'red';
         //jobs[i].remove();
         console.log(jobs[i]);
      }
   }
}