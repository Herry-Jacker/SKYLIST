// Create Modal
const addPlanModal = new bootstrap.Modal('#staticBackdrop');

document.querySelector('.addNew').onclick = _ => {
    document.querySelector(".invalid").textContent = "";
    setTimeout(( _ => {
        document.querySelector('.title').focus();
    }), 1000);
};
document.querySelector('.addNew2').onclick = _ => {
    document.querySelector(".invalid").textContent = "";
    setTimeout(( _ => {
        document.querySelector('.title').focus();
    }), 1000);
};

document.querySelector("#createPlan").onclick = _ => {
    let title = document.querySelector('.title').value;
    if(title == "") {
        document.querySelector(".invalid").textContent = "Please fill plan title";
        return;
    }
    addPlanModal.hide();
    let descrip = document.querySelector('.descrip').value;
    savePlan(title, descrip);
    createPlan(title, descrip);
    document.querySelector('.title').value = "";
    document.querySelector('.descrip').value = "";
}

document.querySelector(".title").onkeyup = a => a.key == "Enter" ? document.querySelector(".descrip").focus() : "";
document.querySelector(".edit-title").onkeyup = a => a.key == "Enter" ? document.querySelector(".edit-descrip").focus() : "";

// Edit Modal
const editPlanModal = new bootstrap.Modal('#staticBackdrop2');


document.querySelector('#editPlan').onclick = _ => {
    let planID = localStorage.getItem("planID");
    let main = JSON.parse(localStorage.getItem('planData'));
    let newTitle = document.querySelector('.edit-title').value;
    let newDescrip = document.querySelector('.edit-descrip').value;
    editPlanModal.hide();
    main[planID].title = newTitle;
    main[planID].descrip = newDescrip;
    localStorage.setItem('planData', JSON.stringify(main));
    let plusID = +planID + 1;
    document.querySelector(`.list-group-item:nth-child(${plusID})>h1>span`).textContent = newTitle;
    document.querySelector(`.list-group-item:nth-child(${plusID})>span`).textContent = newDescrip;
}


//Search

const searchInput = document.querySelector("[data-search]");

searchInput.addEventListener("input", e => {
    const inputValue = e.target.value.toLowerCase();
    let result = Array.from(document.querySelector("#planList").children);
    let listing = result.map(item => {
        let card = item;
        let title = item.children[0].children[0].textContent.toLowerCase();
        let descrip = item.children[1].textContent.toLowerCase();
        return {card, title, descrip};
    });
    
    
    listing.map(item => {
        const isVisible = item.title.includes(inputValue) || item.descrip.includes(inputValue);
        item.card.classList.toggle("d-none", !isVisible);
    });
})


// plan data
let getPlan = () => {
    return JSON.parse(localStorage.getItem("planData")) || [];
}

//localStorage.setItem("planData", JSON.stringify([]));

let todayCount = localStorage.getItem("todayCount");
document.querySelector(".today-count").textContent = todayCount;

let savePlan = (title, descrip) => {
    let Plan = getPlan();
    Plan.push({title, descrip, tasks: [], list: "li"});
    localStorage.setItem("planData", JSON.stringify(Plan));
}

let removePlan = (title) => {
    let Plan = getPlan();
    let result = Plan.filter(item => item.title != title);
    localStorage.setItem("planData", JSON.stringify(result));
}

const createPlan = (title, descrip) => {
    let li = document.createElement("li");
    li.classList.add('list-group-item', 'mt-2', 'secondary-effect', 'text-light', 'rounded', 'p-4');

    let h1 = document.createElement("h1");
    h1.classList.add('h4');
    let h4 = document.createElement('span');
    h4.textContent = title;
    h1.appendChild(h4);
    let deletePlan = document.createElement("a");
    deletePlan.classList.add('fas', 'fa-trash', 'float-end', 'text-danger', 'fs-6', 'text-decoration-none');
    h1.appendChild(deletePlan);
    let editPlan = document.createElement("a");
    let toggle= document.createAttribute('data-bs-toggle');
    toggle.value = 'modal';
    let target = document.createAttribute('data-bs-target');
    target.value = '#staticBackdrop2';
    editPlan.setAttributeNode(toggle);
    editPlan.setAttributeNode(target);
    editPlan.classList.add('fas', 'fa-pen-to-square', 'float-end', 'fs-6', 'pe-4', 'text-decoration-none');
    editPlan.onclick = _ => {
        let planDetails = getPlan();
        planDetails.map(item => {
            if(item.title == title) {
                let planListID = planDetails.indexOf(item);
                localStorage.setItem("planID", planListID);
            };
        });
        let planID = localStorage.getItem("planID");
        let tempTitle = planDetails[planID].title;
        let tempDescrip = planDetails[planID].descrip;
        document.querySelector('.edit-title').value = tempTitle;
        document.querySelector('.edit-descrip').value = tempDescrip;
        setTimeout(( _ => {
            document.querySelector('.edit-title').focus();
        }), 1000);
    }
    h1.appendChild(editPlan);

    let description = document.createElement('span');
    description.classList.add('fs-6', 'text-main');
    description.textContent = descrip;

    let att = document.createAttribute('href');
    att.value = "./plan_details.html";
    let seeMore = document.createElement('a');
    seeMore.setAttributeNode(att);
    seeMore.classList.add('float-end');
    seeMore.textContent = "see more";
    seeMore.onclick = _ => {
        let planDetails = getPlan();
        planDetails.map(item => {
            if(item.title == title) {
                let planListID = planDetails.indexOf(item);
                localStorage.setItem("planID", planListID);
            };
        });
    };

    li.appendChild(h1);
    li.appendChild(description);
    li.appendChild(seeMore);

    deletePlan.onclick = _ => {
        li.remove();
        removePlan(title);
    }

    document.querySelector('#planList').appendChild(li);
}

getPlan().map(item => {
    createPlan(item.title, item.descrip);
});