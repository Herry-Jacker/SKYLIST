const getPlanDetails = JSON.parse(localStorage.getItem("planData"))

const getPlanID = localStorage.getItem("planID");

if(getPlanID == "") {
    location.href="./plan_list.html";
}

const TITLE = getPlanDetails[getPlanID].title;
document.querySelector(".title").textContent = TITLE;
document.querySelector('.breadTitle').textContent = TITLE;

const DESCRIP = getPlanDetails[getPlanID].descrip;
document.querySelector('.descrip').textContent = DESCRIP;

let Tasks = getPlanDetails[getPlanID].tasks;

if(getPlanID == "") {
    location.href("./plan_list.html");
}






// Modal
document.querySelector('.edit').onclick = _ => {
    let planDetails = JSON.parse(localStorage.getItem("planData"));
    let tempTitle = planDetails[getPlanID].title;
    let tempDescrip = planDetails[getPlanID].descrip;
    document.querySelector('.edit-title').value = tempTitle;
    document.querySelector('.edit-descrip').value = tempDescrip;
    setTimeout(( _ => {
        document.querySelector('.edit-title').focus();
    }), 1000);
}

const editPlanModal = new bootstrap.Modal('#staticBackdrop2');

document.querySelector(".edit-title").onkeyup = a => a.key == "Enter" ? document.querySelector(".edit-descrip").focus() : "";


document.querySelector('#editPlan').onclick = _ => {
    let main = JSON.parse(localStorage.getItem('planData'));
    let newTitle = document.querySelector('.edit-title').value;
    let newDescrip = document.querySelector('.edit-descrip').value;
    editPlanModal.hide();
    main[getPlanID].title = newTitle;
    main[getPlanID].descrip = newDescrip;
    localStorage.setItem('planData', JSON.stringify(main));
    document.querySelector(".title").textContent = newTitle;
    document.querySelector('.breadTitle').textContent = newTitle;
    document.querySelector('.descrip').textContent = newDescrip;
}









//Save Tasks

let saveTask = (task) => {
    let datas = Tasks;
    let main = getPlanDetails;
    datas.push({task, done: false});
    main[getPlanID].tasks = datas;
    localStorage.setItem('planData', JSON.stringify(main));
}

let checkTask = (task) => {
    let main = getPlanDetails;
    let result = main[getPlanID].tasks.map( item => {
        if(item.task == task) {
            item.done = true;
        };
        return item;
    })
    main[getPlanID].tasks = result;
    localStorage.setItem('planData', JSON.stringify(main));
};

let removeTask = (task) => {
    let main = getPlanDetails;
    let result = main[getPlanID].tasks.filter( item => item.task != task);
    main[getPlanID].tasks = result;
    localStorage.setItem('planData', JSON.stringify(main));
}

// Details page

document.querySelector(".add-task").onclick = () => {
    let task = document.querySelector(".task-value").value;
    if( task.trim() == "") {
        document.querySelector(".task-value").value = "";
        return;
    }
    creatPlanTask(task);
    saveTask(task);
    document.querySelector(".task-value").value = "";
    updateCount();
}

document.querySelector(".task-value").onkeydown = a => a.key == "Enter" ? document.querySelector(".add-task").onclick() : "";

let updateCount = () => {
    let count = document.querySelectorAll(".fa-circle-check").length;
    let completedCount = document.querySelectorAll(".fa-trash").length - count;
    document.querySelector(".badge").textContent = count;
    document.querySelector(".done_badge").textContent = `You have ${completedCount} tasks completed!`;
}

document.querySelector("#clear").onclick = _ => {
    let main = getPlanDetails;
    let result = main[getPlanID].tasks.filter(item => item.done != true);
    main[getPlanID].tasks = result;
    localStorage.setItem('planData', JSON.stringify(main));
    document.getElementById("#done").textContent = "";
    document.querySelector(".done_badge").textContent = `You have 0 task completed!`;
}

let creatPlanTask = (task, done = false) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "main_color", "text-light", "mt-2", "rounded");
    li.textContent = task;

    let del = document.createElement("a");
    del.classList.add("fas", "fa-trash", "text-danger", "float-end", "del", "text-decoration-none", "mt-1");
    li.appendChild(del);
    del.onclick = _ => {
        li.remove();
        updateCount();
        removeTask(task);
    }

    let check = document.createElement("a");
    check.classList.add("fa", "fa-circle-check", "float-start", "me-3", "text-decoration-none", "mt-1");
    check.onclick = _ => {
        check.remove();
        document.getElementById("#done").appendChild(li);
        updateCount();
        checkTask(task);
    }
    
    if(done) {
        document.getElementById("#done").appendChild(li);
        li.classList.add("text-decoration-line-through");
    } else {
        li.appendChild(check); 
        document.getElementById("#todo").appendChild(li);
    }
}

Tasks.map( item => {
    creatPlanTask(item.task, item.done);
    updateCount();
});