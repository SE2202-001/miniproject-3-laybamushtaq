class Job { //Job class
    //Create class constructor
    constructor(title, postedTime, type, level, skill, detail, estimatedTime, jobNo, jobPageLink) {
    this.title = title;
    this.postedTime = postedTime; 
    this.type = type;
    this.level = level;
    this.skill = skill;
    this.detail = detail;
    this.estimatedTime = estimatedTime;
    this.jobNo = jobNo;
    this.jobPageLink = jobPageLink;
    }
    //Methods for job details 
    getDetails() {
    return `${this.title} (${this.type}, ${this.level})`; //Returns basic job details 
    }

    getFullDetails() {
    return `Job No: ${this.jobNo}
Title: ${this.title}
Posted: ${this.postedTime}
Type: ${this.type}
Level: ${this.level}
Skill: ${this.skill}
Estimated Time: ${this.estimatedTime}
Detail: ${this.detail}
Job Page Link: ${this.jobPageLink}`;
    }  //Returns all job detils 
}

let jobs = []; //Array for jobs 

//EventListener to upload and read file (upwork_jobs.json)
document.getElementById('fileUpload').addEventListener('change', function(event) {
const file = event.target.files[0];
if (file) {
const reader = new FileReader(); //Create FileReader to read file
reader.onload = function(e) {
    try { //Parse file and convert to job objects 
    const jobData = JSON.parse(e.target.result);
        jobs = jobData.map(job => new Job(
        job.Title,
        job.Posted,
        job.Type,
        job.Level,
        job.Skill,
        job.Detail,
        job["Estimated Time"],
        job["Job No"],
        job["Job Page Link"]
        ));

        populateFilters(jobs); //Populate filters
         displayJobListings(jobs); //Display all jobs
        } catch (error) { //If file is empty print error message 
             alert('Error parsing JSON file: ' + error.message);
        }
        };
        reader.readAsText(file); //Read file as text
    }
});
//Create function to populate the filters for type, level and skill
function populateFilters(jobs) {
const jobTypeSet = new Set();
const jobLevelSet = new Set();
const jobSkillSet = new Set();
//Looping through entire job array to add values to filters 
jobs.forEach(job => {
    jobTypeSet.add(job.type);
    jobLevelSet.add(job.level);
    jobSkillSet.add(job.skill);
    });
//Add appropriate dropdowns to each filter 
populateFilterOptions('jobType', jobTypeSet);
populateFilterOptions('jobLevel', jobLevelSet);
populateFilterOptions('jobSkill', jobSkillSet);
}
//Function to make dropdowns 
function populateFilterOptions(filterId, optionsSet) {
    const filterElement = document.getElementById(filterId);
    filterElement.innerHTML = '<option value="">All</option>';//Show all by default 
    optionsSet.forEach(option => {
    const optionElement = document.createElement('option');//Create option
    optionElement.value = option;//Set a value 
    optionElement.textContent = option;//Display appropriate text
    filterElement.appendChild(optionElement);//Append
    });
}
//EventListener to apply filters 
document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); //Prevent resubmission 
    applyFilters();//Apply filters 
});
//Function to apply filters for type, level and skill
function applyFilters() {
const jobType = document.getElementById('jobType').value;
const jobLevel = document.getElementById('jobLevel').value;
const jobSkill = document.getElementById('jobSkill').value;
const sort = document.getElementById('sort').value;
//Filter through jobs to find matches to filters 
    let filteredJobs = jobs.filter(job => {
        return (jobType === '' || job.type === jobType) &&
               (jobLevel === '' || job.level === jobLevel) &&
               (jobSkill === '' || job.skill === jobSkill);
    });
//Sort filtered jobs based on date or title 
    if (sort === 'date') {
    filteredJobs.sort((a, b) => new Date(b.postedTime) - new Date(a.postedTime));
    } else if (sort === 'title') {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    }

    displayJobListings(filteredJobs); //Display filtered and sorted jobs 
}
//Function to display jobs 
function displayJobListings(jobs) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';  //Clear previous listings
//If no matches to filter 
    if (jobs.length === 0) {
    //Display "No results found" message
    const noResultsMessage = document.createElement('li');
    noResultsMessage.textContent = 'No results found';
    noResultsMessage.style.textAlign = 'center';  //Center message
    jobList.appendChild(noResultsMessage); //Add message to job list
} else {
        //Else display jobs
    jobs.forEach(job => {
    const li = document.createElement('li');//New list for each job
    li.textContent = job.getDetails();//Display description 
    li.addEventListener('click', () => {
        alert(job.getFullDetails());//Full details displayed if clicked 
    });
     jobList.appendChild(li);//Append job to list
        });
    }
}
