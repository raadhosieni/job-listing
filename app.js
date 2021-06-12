//create jobs global array
let jobs = [];

//create filter object
let jobFilter = {
    role: "",
    level: "",
    languages: [],
    tools: []
}

//fetch data from data.json file
fetch(`data.json`).then(function(response) {
    return response.json();
}).then(function(obj) {
    jobs = obj;
}).then(function () {
    createJobs(jobs);   

}).catch(function(error) {
    console.error('something went wrong with retrieving the data!');
    console.error(error);
});


//select container div
const container = document.querySelector('.container');

//create job elements and append them to the container
function createJobs(jsongObj) {
    container.innerHTML = "";
    container.appendChild(createFilterElement());
    for (let i = 0; i < jsongObj.length; i++) {
        //create job div and assign job class to it
        const job = document.createElement('div');
        job.setAttribute('class', 'job');
        //create logo element and append it to the job div
        const logo = document.createElement('img');
        logo.setAttribute('src', jsongObj[i].logo);
        job.appendChild(logo);
        //create job info div
        const jobInfo = document.createElement('div');
        jobInfo.setAttribute('class', 'job-info');

        //-----------------------------------------
        //create top info div
        const topInfo = document.createElement('div');
        topInfo.setAttribute('class', 'top-info');
        //create company name span
        const companyName = document.createElement('span');
        companyName.setAttribute('class', 'company-name');
        companyName.textContent = jsongObj[i].company;
        topInfo.appendChild(companyName);
        //create new span
        if (jsongObj[i].new) {
            const newElement = document.createElement('span');
            newElement.setAttribute('class', 'new');
            newElement.textContent = "New!";
            topInfo.appendChild(newElement);
        }
        //create featured span
        if (jsongObj[i].featured) {
            const featured = document.createElement('span');
            featured.setAttribute('class', 'featured');
            featured.textContent = "Featured";
            topInfo.appendChild(featured);
            job.classList.add('featured');
        }
        
        jobInfo.appendChild(topInfo);
        
        //create job title element 
        const position = document.createElement('h2');
        position.setAttribute('class', 'position');
        position.textContent = jsongObj[i].position;
    
        jobInfo.appendChild(position);

        //--------------------------------
        //create down info div
        const downInfo = document.createElement('div');
        downInfo.setAttribute('class', 'down-info');

        //create postedAt span
        const postedAt = document.createElement('span');
        postedAt.setAttribute('class', 'date');
        postedAt.textContent = jsongObj[i].postedAt;
        downInfo.appendChild(postedAt);

        //create contract span
        const contract = document.createElement('span');
        contract.setAttribute('class', 'contract');
        contract.textContent = jsongObj[i].contract;
        downInfo.appendChild(contract);

        //create location span
        const location = document.createElement('span');
        location.setAttribute('class', 'location');
        location.textContent = jsongObj[i].location;
        downInfo.appendChild(location);

        jobInfo.appendChild(downInfo);

        //append job info div to job div
        job.appendChild(jobInfo);
        
        //create job tags div
        const jobTags = document.createElement('div');
        jobTags.setAttribute('class', 'job-tags');

        //create role span
        const role = document.createElement('span');
        role.setAttribute('class', 'job-tag');
        role.setAttribute('data-role', jsongObj[i].role);
        role.textContent = jsongObj[i].role;
        jobTags.appendChild(role);

        //create level span
        const level = document.createElement('span');
        level.setAttribute('class', 'job-tag');
        level.setAttribute('data-level', jsongObj[i].level);
        level.textContent = jsongObj[i].level;
        jobTags.appendChild(level);

        //create language spans
        const langs = jsongObj[i].languages;
        langs.forEach(element => {
               const lang = document.createElement('span');
               lang.setAttribute('class', 'job-tag');
               lang.setAttribute('data-lang', element);
               lang.textContent = element;
               jobTags.appendChild(lang);
        });

        //create tool spans
        const tools = jsongObj[i].tools;
        tools.forEach(element => {
            const tool = document.createElement('span');
            tool.setAttribute('class', 'job-tag');
            tool.setAttribute('data-tool', element);
            tool.textContent = element;
            jobTags.appendChild(tool);
        })

        //append job tags div to job div
        job.appendChild(jobTags);

        //append job div to container
        container.appendChild(job);
    }

    setJobTagEvent()
}

function setJobTagEvent() {
    //select tag elements in each job card
    jobTags = document.querySelectorAll('.job .job-tags span');
    jobTags.forEach(function(jobTag) {
        /*
            when click on jobTag element
            -update filter
            -create new filtered array from jobs array
            -create job cards uppon the new array

        */
        jobTag.onclick = function() {
            updateFilter(jobFilter, this);
            let tempJobs = filterJobsArray(jobs);
            createJobs(tempJobs);
        }
    });
}

//return new filtered array from jobs array uppon jobFilter object
function filterJobsArray(arr) {
    let tempJobs = arr.filter(function(job) {
        let flag = true;
        
        if (jobFilter.role !== "" && jobFilter.role !== job.role) {
            flag = false;
        }

        if (jobFilter.level !== "" && jobFilter.level !== job.level) {
            flag = false;
        }

        jobFilter.languages.forEach(function(lang) {
            if (!job.languages.includes(lang)) {
                flag = false;
            }
        });

        jobFilter.tools.forEach(function(tool) {
            if (!job.tools.includes(tool)) {
                flag = false;
            }
        })

        if(flag === true) {
            return job;
        }
    });

    return tempJobs;
}

//update filterObject 
function updateFilter(filterObject, jobTag) {
    if (jobTag.getAttribute('data-role') !== null) {
        filterObject.role = jobTag.getAttribute('data-role');    
    }
    if (jobTag.getAttribute('data-level') !== null) {
        filterObject.level = jobTag.getAttribute('data-level');
    }
    let lang = jobTag.getAttribute('data-lang');
    if (lang !== null) {

        if (! filterObject.languages.includes(lang)) {
            filterObject.languages.push(lang);
        }
    }
    let tool = jobTag.getAttribute('data-tool');
    if (tool !== null) {
        if (! filterObject.tools.includes(tool)) {
            filterObject.tools.push(tool);
        }
    }
}

//create filter element
function createFilterElement() {
    const filterElement = document.createElement('div');
    filterElement.setAttribute('class', 'filter');

    //create tag elements
    const tags = document.createElement('div');
    tags.setAttribute('class', 'tags');

    if(jobFilter.role !== "") {
        tags.appendChild(createTag(jobFilter.role, 'role'));
    }

    if (jobFilter.level !== "") {
        tags.appendChild(createTag(jobFilter.level, "level"));
    }

    if (jobFilter.languages.length) {
        jobFilter.languages.forEach(function(lang) {
            tags.appendChild(createTag(lang, 'lang'));
        })
    }

    if (jobFilter.tools.length) {
        jobFilter.tools.forEach(function(tool) {
            tags.appendChild(createTag(tool, 'tool'));
        })
    }

    //append tags to the filter container
    filterElement.appendChild(tags);

    //create clear button
    let clearButton = document.createElement('button');
    clearButton.setAttribute('class', 'clear');
    clearButton.textContent = 'Clear';

    clearButton.onclick = function() {
        clearFilter();
        let tempJobs = filterJobsArray(jobs);
        createJobs(tempJobs);
    }

    //append clear button to filter container
    filterElement.appendChild(clearButton);

    //add click event to filter tags
    addOnclickEventToTag(filterElement);
    
    if (filterElement.querySelector('.tags').children.length === 0) {
        filterElement.classList.add('hidden');
    }

    return filterElement;
}


//select clear button



//clear the filterObject 
function clearFilter() {
    jobFilter.role = "";
    jobFilter.level = "";
    jobFilter.languages = [];
    jobFilter.tools = [];
}


//create tag element
function createTag(dataText, dataType) {
    const tag = document.createElement('div');
    tag.setAttribute('class', 'tag');
    tag.setAttribute('data-type', dataType);

    //create span inside tag
    const content = document.createElement('span');
    content.textContent = dataText;
    tag.appendChild(content);
    
    //create close icon
    const closeIcon = document.createElement('figure');
    const image = document.createElement('img');
    image.setAttribute('src', 'images/icon-remove.svg');
    closeIcon.appendChild(image);

    //append close icon to tag element
    tag.appendChild(closeIcon);

    return tag;
}

//add click event to tag in filter container
function addOnclickEventToTag(filterContainer) {
    //select tags in filterContainer
    const tagCloseButtons = filterContainer.querySelectorAll('.tags .tag figure');
    const tags = filterContainer.querySelector('.tags');
    tagCloseButtons.forEach(function(tagCloseButton) {
        //remove tag from filter when click on close button
        tagCloseButton.onclick = function () {
            
            let tagType = tagCloseButton.parentElement.getAttribute('data-type');
            if (tagType === 'role') {
                jobFilter.role = "";
            }

            if (tagType === 'level') {
                jobFilter.level = "";
            }

            if (tagType === 'lang') {
                jobFilter.languages = jobFilter.languages.filter(function(langItem) {
                    if (langItem !== tagCloseButton.parentElement.firstChild.textContent) {
                        return langItem;
                    }
                })
            }

            if (tagType === 'tool') {
                jobFilter.tools = jobFilter.tools.filter(function(tool) {
                    if (tool !== tagCloseButton.parentElement.firstChild.textContent) {
                        return tool;
                    }
                }) 
            }

            //-------------------------------
            let tempJobs = filterJobsArray(jobs);
            createJobs(tempJobs);
            tags.removeChild(tagCloseButton.parentElement);  
            if (tags.children.length === 0) {
                document.querySelector('.filter').classList.add('hidden');
            }
        }
    })
}