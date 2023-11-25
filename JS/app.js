document.querySelector(".toggle_menu").onclick = () => {
    document.querySelector('.toggle_menu').classList.toggle("mobile-active");
    document.querySelector('.mobile-nav').classList.toggle('mobile-active');
}

window.addEventListener('scroll', () => {
    const scrollvalue = window.scrollY;
    if (50 < scrollvalue) {
        document.querySelector("header").classList.add("sticky-effect");
    } else {
        document.querySelector("header").classList.remove("sticky-effect");
    };
})

const restart = document.querySelector(".restart-btn");

// let todayRestart = [];

// let upcomingRestart = [];
// for( let i = 1; i <= 30; i++) {
//     upcomingRestart.push({taskgroup: [], date: ""})
// }


restart.onclick = _ => {
    localStorage.removeItem("upcomingData");
    localStorage.removeItem("data");
    localStorage.removeItem("planData");
    localStorage.setItem("planID", "");
    localStorage.removeItem("todayCount");
    location.reload();
}