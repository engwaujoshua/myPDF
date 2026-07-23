const allToolsWrapper = document.querySelector(".all-tools-wrapper");
const allToolsLink = allToolsWrapper.querySelector("a");

allToolsWrapper.addEventListener("mouseenter", () => {
    allToolsLink.classList.add("active");
});

allToolsWrapper.addEventListener("mouseleave", () => {
    allToolsLink.classList.remove("active");
});

const currentPage = window.location.pathname;

document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.pathname === currentPage) {
        link.classList.add("active");
    }
});