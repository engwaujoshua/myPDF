const pdfInput = document.getElementById("pdf-files");

const fileList = document.getElementById("file-list");

const mergeButton = document.getElementById("merge-button");

const downloadLink = document.getElementById("download-link");


let selectedFiles = [];


// Select files
pdfInput.addEventListener("change", function () {

    selectedFiles = Array.from(pdfInput.files);

    displayFiles();

});


// Display selected files
function displayFiles() {

    fileList.innerHTML = "";


    selectedFiles.forEach(function (file, index) {

        const fileItem = document.createElement("div");

        fileItem.classList.add("file-item");


        fileItem.innerHTML = `

            <span>
                ${index + 1}. ${file.name}
            </span>

            <div>

                <button class="move-up-button">
                    ↑
                </button>

                <button class="move-down-button">
                    ↓
                </button>

                <button class="remove-button">
                    remove
                </button>

            </div>

        `;


        const moveUpButton =
            fileItem.querySelector(".move-up-button");


        const moveDownButton =
            fileItem.querySelector(".move-down-button");


        const removeButton =
            fileItem.querySelector(".remove-button");


        moveUpButton.addEventListener("click", function () {

            moveFileUp(index);

        });


        moveDownButton.addEventListener("click", function () {

            moveFileDown(index);

        });


        removeButton.addEventListener("click", function () {

            removeFile(index);

        });


        fileList.appendChild(fileItem);

    });


    mergeButton.disabled = selectedFiles.length < 2;

}


// Move file up
function moveFileUp(index) {

    if (index === 0) {

        return;

    }


    const temporaryFile = selectedFiles[index];

    selectedFiles[index] = selectedFiles[index - 1];

    selectedFiles[index - 1] = temporaryFile;


    displayFiles();

}


// Move file down
function moveFileDown(index) {

    if (index === selectedFiles.length - 1) {

        return;

    }


    const temporaryFile = selectedFiles[index];

    selectedFiles[index] = selectedFiles[index + 1];

    selectedFiles[index + 1] = temporaryFile;


    displayFiles();

}


// Remove file
function removeFile(index) {

    selectedFiles.splice(index, 1);

    displayFiles();

}


// Merge PDFs
mergeButton.addEventListener("click", async function () {

    try {

        mergeButton.disabled = true;

        mergeButton.textContent = "merging...";


        if (typeof PDFLib === "undefined") {

            throw new Error(
                "PDF-LIB was not loaded."
            );

        }


        const mergedPdf =
            await PDFLib.PDFDocument.create();


        for (const file of selectedFiles) {

            const fileBytes =
                await file.arrayBuffer();


            const pdf =
                await PDFLib.PDFDocument.load(fileBytes);


            const copiedPages =
                await mergedPdf.copyPages(

                    pdf,

                    pdf.getPageIndices()

                );


            copiedPages.forEach(function (page) {

                mergedPdf.addPage(page);

            });

        }


        const mergedPdfBytes =
            await mergedPdf.save();


        const blob = new Blob(

            [mergedPdfBytes],

            {
                type: "application/pdf"
            }

        );


        const url =
            URL.createObjectURL(blob);


        downloadLink.href = url;

        downloadLink.download = "merged.pdf";

        downloadLink.textContent =
            "download merged PDF";

        downloadLink.style.display =
            "block";


        mergeButton.textContent =
            "merge PDFs";

        mergeButton.disabled =
            false;


    } catch (error) {

        console.error(error);


        alert(
            "Something went wrong while merging the PDFs."
        );


        mergeButton.textContent =
            "merge PDFs";

        mergeButton.disabled =
            false;

    }

});