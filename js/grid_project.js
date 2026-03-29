
const hamburger = document.querySelector(".hamburger");
const bar1 = document.querySelector(".bar1");
const bar2 = document.querySelector(".bar2");
const bar3 = document.querySelector(".bar3");
const mobile_nav = document.querySelector(".mobile_nav");

hamburger.addEventListener("click", () => {
    bar1.classList.toggle("animatebar1")
    bar2.classList.toggle("animatebar2")
    bar3.classList.toggle("animatebar3")
    mobile_nav.classList.toggle("open_drawer")
});

// one way to use javascript with CSS is to select a class that no element has in CSS and give that class styles, then activate it with javascript.