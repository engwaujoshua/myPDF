const searchInput = document.getElementById("tool-search");

searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    console.log("Searching for:", searchTerm);
});