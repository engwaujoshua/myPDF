const pdfInput =
    document.getElementById("pdf-file");

const titleInput =
    document.getElementById("pdf-title");

const authorInput =
    document.getElementById("pdf-author");

const subjectInput =
    document.getElementById("pdf-subject");

const keywordsInput =
    document.getElementById("pdf-keywords");

const creatorInput =
    document.getElementById("pdf-creator");

const saveButton =
    document.getElementById(
        "save-metadata-button"
    );

const downloadLink =
    document.getElementById(
        "download-link"
    );


let selectedFile = null;


// Select PDF
pdfInput.addEventListener(
    "change",
    async function () {


        selectedFile =
            pdfInput.files[0];


        if (!selectedFile) {

            saveButton.disabled = true;

            return;

        }


        try {


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            titleInput.value =
                pdfDoc.getTitle() || "";


            authorInput.value =
                pdfDoc.getAuthor() || "";


            subjectInput.value =
                pdfDoc.getSubject() || "";


            keywordsInput.value =
                pdfDoc.getKeywords() || "";


            creatorInput.value =
                pdfDoc.getCreator() || "";


            saveButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(
                "Could not read this PDF."
            );

        }

    }
);


// Save metadata
saveButton.addEventListener(
    "click",
    async function () {


        try {


            saveButton.disabled =
                true;


            saveButton.textContent =
                "saving...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            pdfDoc.setTitle(
                titleInput.value
            );


            pdfDoc.setAuthor(
                authorInput.value
            );


            pdfDoc.setSubject(
                subjectInput.value
            );


            pdfDoc.setKeywords(

                keywordsInput.value

                    .split(",")

                    .map(function (keyword) {

                        return keyword.trim();

                    })

                    .filter(function (keyword) {

                        return keyword.length > 0;

                    })

            );


            pdfDoc.setCreator(
                creatorInput.value
            );


            const updatedPdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(
                    [updatedPdfBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "updated-metadata.pdf";


            downloadLink.textContent =
                "download updated PDF";


            downloadLink.style.display =
                "block";


            saveButton.textContent =
                "save metadata";


            saveButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(
                "Something went wrong while saving the metadata."
            );


            saveButton.textContent =
                "save metadata";


            saveButton.disabled =
                false;

        }

    }
);