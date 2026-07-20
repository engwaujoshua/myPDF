const pdfInput =
    document.getElementById("pdf-file");

const cropTop =
    document.getElementById("crop-top");

const cropRight =
    document.getElementById("crop-right");

const cropBottom =
    document.getElementById("crop-bottom");

const cropLeft =
    document.getElementById("crop-left");

const cropButton =
    document.getElementById("crop-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {

        selectedFile =
            pdfInput.files[0];


        cropButton.disabled =
            !selectedFile;

    }
);


// Crop PDF
cropButton.addEventListener(
    "click",
    async function () {

        try {


            cropButton.disabled =
                true;


            cropButton.textContent =
                "cropping...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            const pages =
                pdfDoc.getPages();


            const top =
                Number(
                    cropTop.value
                );


            const right =
                Number(
                    cropRight.value
                );


            const bottom =
                Number(
                    cropBottom.value
                );


            const left =
                Number(
                    cropLeft.value
                );


            pages.forEach(function (page) {


                const { width, height } =
                    page.getSize();


                const newWidth =
                    width - left - right;


                const newHeight =
                    height - top - bottom;


                if (
                    newWidth <= 0 ||
                    newHeight <= 0
                ) {

                    throw new Error(
                        "Crop values are too large."
                    );

                }


                page.setCropBox(

                    left,

                    bottom,

                    newWidth,

                    newHeight

                );


                page.setMediaBox(

                    left,

                    bottom,

                    newWidth,

                    newHeight

                );

            });


            const croppedPdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(

                    [croppedPdfBytes],

                    {

                        type: "application/pdf"

                    }

                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "cropped.pdf";


            downloadLink.textContent =
                "download cropped PDF";


            downloadLink.style.display =
                "block";


            cropButton.textContent =
                "crop PDF";


            cropButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while cropping the PDF."

            );


            cropButton.textContent =
                "crop PDF";


            cropButton.disabled =
                false;

        }

    }
);