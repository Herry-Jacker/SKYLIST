// hello
let date = new Date();
let currDate = date.getDate();
const currTime = date.getHours();
const greet = document.querySelector(".greeting");

if(currTime >= 3 && currTime < 12) {
    greet.textContent = "Good Morning,";
} else if (currTime >= 12 && currTime < 17) {
    greet.textContent = "Good Afternoon,";
} else if (currTime >= 17 && currTime <= 24) {
    greet.textContent = "Good Evening,";
} else {
    greet.textContent = "Good Morning,";
}

// get upcoming data

let structureArray = [];
for( let i = 1; i <= 30; i++) {
    structureArray.push({taskgroup: [], date: ""})
}

const getUpcomingDays = () => {
    return JSON.parse(localStorage.getItem("upcomingData")) || structureArray;
}

if(getUpcomingDays()[0].date == currDate) {
    let dataTrans = [];
    getUpcomingDays()[0].taskgroup.map( text => dataTrans.push({text, done: false}));
    let dataNext = getUpcomingDays();
    dataNext.shift();
    dataNext.push({taskgroup: [], date: ""});
    localStorage.setItem("data", JSON.stringify(dataTrans));
    localStorage.setItem("upcomingData", JSON.stringify(dataNext));
}

// todo
let getData = () => {
    return JSON.parse(localStorage.getItem("data")) || [];
}

let saveData = (text) => {
    let data = getData();
    data.push({text, done: false});
    localStorage.setItem("data", JSON.stringify(data));
}

let removeData = (text) => {
    let data = getData();
    let result = data.filter(item => item.text != text);
    localStorage.setItem("data", JSON.stringify(result))
}


document.querySelector(".create-task").onclick = () => {
    let text = document.querySelector("input").value;
    if( text.trim() == "") {
        document.querySelector("input").value = "";
        return;
    }
    creatText(text);
    saveData(text);
    document.querySelector("input").value = "";
    updateCount();
}

document.querySelector("input").onkeydown = a => a.key == "Enter" ? document.querySelector(".create-task").onclick() : "";

let updateCount = () => {
    let count = document.querySelectorAll(".fa-circle-check").length;
    let completedCount = document.querySelectorAll(".fa-trash").length - count;
    document.querySelector(".badge").textContent = count;
    document.querySelector(".done_badge").textContent = `You have ${completedCount} tasks completed!`;
    localStorage.setItem("todayCount", JSON.stringify(count));
}

let checkData = (text) => {
    let data = getData();
    let result = data.map( item => {
        if (item.text == text) {
            item.done = true;
        }
        return item;
    })
    localStorage.setItem("data", JSON.stringify(result));
}

document.querySelector("#clear").onclick = _ => {
    let data = getData();
    let result = data.filter(item => item.done != true);
    localStorage.setItem("data", JSON.stringify(result));
    document.getElementById("#done").textContent = "";
    document.querySelector(".done_badge").textContent = `You have 0 task completed!`;
}

let creatText = (text, done = false) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "main_color", "text-light", "mt-2", "rounded");
    li.textContent = text;

    let del = document.createElement("a");
    del.classList.add("fas", "fa-trash", "text-danger", "float-end", "del", "text-decoration-none", "mt-1");
    li.appendChild(del);
    del.onclick = _ => {
        li.remove();
        updateCount();
        removeData(text);
    }

    let check = document.createElement("a");
    check.classList.add("fa", "fa-circle-check", "float-start", "me-3", "text-decoration-none", "mt-1");
    check.onclick = _ => {
        check.remove();
        document.getElementById("#done").appendChild(li);
        li.classList.add("text-decoration-line-through");
        updateCount();
        checkData(text);
    }

    if(done) {
        document.getElementById("#done").appendChild(li);
        li.classList.add("text-decoration-line-through");
    } else {
        li.appendChild(check); 
        document.getElementById("#todo").appendChild(li);
    }
}
getData().map(item => {
    creatText(item.text, item.done);
    updateCount();
})