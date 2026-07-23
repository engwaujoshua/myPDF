const pdfInput = document.getElementById("pdf-file");
const compressButton = document.getElementById("compress-button");
const compressStatus = document.getElementById("compress-status");

compressButton.addEventListener("click", () => {
    if (!pdfInput.files[0]) {
        compressStatus.textContent = "Please select a PDF file.";
        return;
    }

    compressStatus.textContent =
        "Compression will be connected to the backend later.";
});