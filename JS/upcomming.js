//
let todayCount = localStorage.getItem("todayCount");
document.querySelector(".today-count").textContent = todayCount;



// Save Data
let structureArray = [];
for( let i = 1; i <= 30; i++) {
    structureArray.push({taskgroup: [], date: ""})
}

let getUpcomingDays = () => {
    return JSON.parse(localStorage.getItem("upcomingData")) || structureArray;
}

let saveUpcomingtask = (text, id) => {
    let result = getUpcomingDays();
    result[id - 1].taskgroup.push(text);
    localStorage.setItem("upcomingData", JSON.stringify(result));
}

let saveUpcomingDate = (date, id) => {
    let result = getUpcomingDays();
    if(result[id - 1].date == "") {
        result[id - 1].date = date;
        localStorage.setItem("upcomingData", JSON.stringify(result));
    }
}

let removeTask = (text, id) => {
    let dataTask = getUpcomingDays();
    let result = dataTask[id - 1].taskgroup.filter(item => item != text);
    dataTask[id - 1].taskgroup = result;
    localStorage.setItem("upcomingData", JSON.stringify(dataTask));
}

//Upcoming UI
let date = new Date(),
currDate = date.getDate();
currYear = date.getFullYear(),
currMonth = date.getMonth();
lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
lastDateofNextMonth = new Date(currYear, currMonth + 2, 0).getDate();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const createUpcomingTask = (text, id) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "main_color", "text-light", "mt-2", "rounded");
    li.textContent = text;

    let del = document.createElement("a");
    del.classList.add("fas", "fa-trash", "text-danger", "float-end", "del", "text-decoration-none", "mt-1");
    del.onclick = () => {
        removeTask(text, id);
        li.remove();
    };
    li.appendChild(del);
    return li;
}


// Add tasks to daily page
if(getUpcomingDays()[0].date == currDate) {
    let dataTrans = [];
    getUpcomingDays()[0].taskgroup.map( text => dataTrans.push({text, done: false}));
    let dataNext = getUpcomingDays();
    dataNext.shift();
    dataNext.push({taskgroup: [], date: ""});
    localStorage.setItem("data", JSON.stringify(dataTrans));
    localStorage.setItem("upcomingData", JSON.stringify(dataNext));
}

const createUpcoming30days = () => {
    let upcomingDate = currDate;
    let upcomingMonth = currMonth;
    let upcomingYear = currYear;
    for( let i = 1; i <= 30; i++) {
        if(upcomingDate == lastDateofMonth) {
            upcomingDate = 0;
            upcomingMonth++;
        }
        if(upcomingMonth == 12) {
            upcomingMonth = 0;
            upcomingYear += 1;
        }
        if(upcomingMonth == 1 && upcomingDate == lastDateofNextMonth) {
            upcomingMonth += 1;
            upcomingDate = 0;
        }
        upcomingDate++;
        let cont = document.createElement("div");

        let div = document.createElement("div");
        div.classList.add("navbar", "nav", "mt-5");
        let dateSpan = document.createElement("span");
        dateSpan.classList.add("text-light", "fs-5");
        dateSpan.textContent = `${months[upcomingMonth]} ${upcomingDate}, ${upcomingYear}`;
        div.appendChild(dateSpan);
        let addNewTask = document.createElement("a");
        addNewTask.textContent = "Add Task"
        addNewTask.classList.add("text-main", "btn", "secondary-bg", "rounded-pill", "btn-sm");
        div.appendChild(addNewTask);

        let hr = document.createElement("hr");
        hr.classList.add("divider", "m-0");

        let inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group", "d-none", "mb-3");
        let taskInput = document.createElement("input");
        taskInput.classList.add("form-control");
        let placeHolder = document.createAttribute("placeholder");
        placeHolder.value = "Enter task";
        let textAtt = document.createAttribute("type");
        textAtt.value = "text";
        taskInput.setAttributeNode(textAtt);
        taskInput.setAttributeNode(placeHolder);
        inputGroup.appendChild(taskInput);
        let plus = document.createElement("button");
        plus.classList.add("input-item", "btn", "text-light", "secondary-bg")
        plus.textContent = "+";
        inputGroup.appendChild(plus);

        let dateGroup = document.createElement("ul");
        dateGroup.classList.add("list-group", `date${i}`);

        if( i == 1 ) {
            inputGroup.classList.add("one");
            inputGroup.classList.remove("d-none");
        }
        
        addNewTask.onclick = () => {
            document.querySelector(".one").classList.add("d-none");
            document.querySelector(".one").classList.remove("one");
            inputGroup.classList.remove("d-none");
            inputGroup.classList.add("one");
            taskInput.focus();
        }
        
        let dataUpcomingDate = upcomingDate;
        saveUpcomingDate(dataUpcomingDate, i);

        plus.onclick = () => {
            let text = taskInput.value;
            if( text.trim() == "") {
                document.querySelector("input").value = "";
                return;
            };
            let addLi = createUpcomingTask(text, i);
            dateGroup.appendChild(addLi);
            saveUpcomingtask(text,i);
            taskInput.value = "";
        }

        taskInput.onkeydown = a => a.key == "Enter" ? plus.onclick() : "";

        getUpcomingDays()[i-1].taskgroup.map( item => {
            let dataLi = createUpcomingTask(item, i);
            dateGroup.appendChild(dataLi);
        });

        cont.appendChild(div);
        cont.appendChild(hr);
        cont.appendChild(inputGroup);
        cont.appendChild(dateGroup);
        document.getElementById("dateContainer").appendChild(cont);
    }
}

createUpcoming30days();