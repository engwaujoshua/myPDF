const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeIcon = document.getElementById("dark-mode-icon");

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDarkMode = document.body.classList.contains("dark-mode");

    darkModeIcon.src = isDarkMode
        ? "/assets/icons/sun.svg"
        : "/assets/icons/moon.svg";
});