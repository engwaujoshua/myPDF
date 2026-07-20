const pdfInput =
    document.getElementById("pdf-file");

const rotationAngle =
    document.getElementById("rotation-angle");

const rotateButton =
    document.getElementById("rotate-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    rotateButton.disabled =
        !selectedFile;

});


// Rotate PDF
rotateButton.addEventListener(
    "click",
    async function () {

        try {


            rotateButton.disabled =
                true;


            rotateButton.textContent =
                "rotating...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            const angle =
                Number(
                    rotationAngle.value
                );


            const pages =
                pdfDoc.getPages();


            pages.forEach(function (page) {

                const currentRotation =
                    page.getRotation().angle;


                page.setRotation(

                    PDFLib.degrees(

                        currentRotation + angle

                    )

                );

            });


            const rotatedPdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(

                    [rotatedPdfBytes],

                    {

                        type: "application/pdf"

                    }

                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "rotated.pdf";


            downloadLink.textContent =
                "download rotated PDF";


            downloadLink.style.display =
                "block";


            rotateButton.textContent =
                "rotate PDF";


            rotateButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while rotating the PDF."

            );


            rotateButton.textContent =
                "rotate PDF";


            rotateButton.disabled =
                false;

        }

    }

);