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

// boAvmrAFfwZEHebYjctgTppwiEwazqIftEMU             job title class identifier 
// job-card-container__footer-item job-card-container__footer-job-state t-bold      viewed job class identifier 