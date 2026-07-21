const uploadArea = document.getElementById("upload-area");
const pdfInput = document.getElementById("pdf-input");
const fileList = document.getElementById("file-list");
const mergeButton = document.getElementById("merge-button");
const downloadLink = document.getElementById("download-link");

let selectedFiles = [];

/* --------------------------
   Upload Area
--------------------------- */

uploadArea.addEventListener("click", () => {
    pdfInput.click();
});

pdfInput.addEventListener("change", () => {

    selectedFiles = Array.from(pdfInput.files);

    renderFileList();

});


uploadArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadArea.classList.add("dragover");

});


uploadArea.addEventListener("dragleave", () => {

    uploadArea.classList.remove("dragover");

});


uploadArea.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadArea.classList.remove("dragover");

    selectedFiles = Array.from(e.dataTransfer.files);

    renderFileList();

});


/* --------------------------
   Render Files
--------------------------- */

function renderFileList() {

    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const row = document.createElement("div");

        row.className = "file-item";

        row.innerHTML = `
            <span>${index + 1}. ${file.name}</span>

            <div>

                <button class="up">↑</button>

                <button class="down">↓</button>

                <button class="remove">✕</button>

            </div>
        `;

        row.querySelector(".up").onclick = () => moveUp(index);

        row.querySelector(".down").onclick = () => moveDown(index);

        row.querySelector(".remove").onclick = () => removeFile(index);

        fileList.appendChild(row);

    });

    mergeButton.disabled = selectedFiles.length < 2;

}


/* --------------------------
   File Controls
--------------------------- */

function moveUp(index) {

    if (index === 0) return;

    [selectedFiles[index], selectedFiles[index - 1]] =
    [selectedFiles[index - 1], selectedFiles[index]];

    renderFileList();

}


function moveDown(index) {

    if (index === selectedFiles.length - 1) return;

    [selectedFiles[index], selectedFiles[index + 1]] =
    [selectedFiles[index + 1], selectedFiles[index]];

    renderFileList();

}


function removeFile(index) {

    selectedFiles.splice(index, 1);

    renderFileList();

}


/* --------------------------
   Merge PDFs
--------------------------- */

mergeButton.addEventListener("click", async () => {

    try {

        mergeButton.disabled = true;

        mergeButton.textContent = "Merging...";

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of selectedFiles) {

            const bytes = await file.arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices()
            );

            pages.forEach(page => mergedPdf.addPage(page));

        }

        const mergedBytes = await mergedPdf.save();

        const blob = new Blob([mergedBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        downloadLink.href = url;

        downloadLink.download = "merged.pdf";

        downloadLink.textContent = "Download merged PDF";

        downloadLink.style.display = "inline-block";

    }

    catch (error) {

        console.error(error);

        alert("Failed to merge PDFs.");

    }

    finally {

        mergeButton.disabled = false;

        mergeButton.textContent = "Merge PDFs";

    }

});S