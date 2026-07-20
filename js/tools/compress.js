const pdfInput = document.getElementById("pdf-file");

const compressionLevel =
    document.getElementById("compression-level");

const compressButton =
    document.getElementById("compress-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    if (selectedFile) {

        compressButton.disabled = false;

    } else {

        compressButton.disabled = true;

    }

});


// Compress PDF
compressButton.addEventListener("click", async function () {

    try {

        compressButton.disabled = true;

        compressButton.textContent = "compressing...";


        if (typeof PDFLib === "undefined") {

            throw new Error(
                "PDF-LIB was not loaded."
            );

        }


        if (!selectedFile) {

            throw new Error(
                "No PDF selected."
            );

        }


        const fileBytes =
            await selectedFile.arrayBuffer();


        const originalPdf =
            await PDFLib.PDFDocument.load(fileBytes);


        const compressedPdf =
            await PDFLib.PDFDocument.create();


        const pageIndices =
            originalPdf.getPageIndices();


        const copiedPages =
            await compressedPdf.copyPages(

                originalPdf,

                pageIndices

            );


        copiedPages.forEach(function (page) {

            compressedPdf.addPage(page);

        });


        const compressedPdfBytes =
            await compressedPdf.save({

                useObjectStreams: true,

                addDefaultPage: false

            });


        const blob = new Blob(

            [compressedPdfBytes],

            {
                type: "application/pdf"
            }

        );


        const url =
            URL.createObjectURL(blob);


        downloadLink.href = url;

        downloadLink.download =
            "compressed.pdf";

        downloadLink.textContent =
            "download compressed PDF";

        downloadLink.style.display =
            "block";


        compressButton.textContent =
            "compress PDF";

        compressButton.disabled =
            false;


    } catch (error) {

        console.error(error);


        alert(
            "Something went wrong while compressing the PDF."
        );


        compressButton.textContent =
            "compress PDF";

        compressButton.disabled =
            false;

    }

});