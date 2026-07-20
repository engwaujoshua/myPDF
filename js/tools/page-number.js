const pdfInput =
    document.getElementById("pdf-file");

const positionInput =
    document.getElementById("page-number-position");

const startingNumberInput =
    document.getElementById("starting-number");

const pageNumberButton =
    document.getElementById("page-number-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    if (selectedFile) {

        pageNumberButton.disabled = false;

    } else {

        pageNumberButton.disabled = true;

    }

});


// Add page numbers
pageNumberButton.addEventListener(
    "click",
    async function () {

        try {

            pageNumberButton.disabled = true;

            pageNumberButton.textContent =
                "adding page numbers...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            const font =
                await pdfDoc.embedFont(
                    PDFLib.StandardFonts.Helvetica
                );


            const pages =
                pdfDoc.getPages();


            const position =
                positionInput.value;


            const startingNumber =
                Number(
                    startingNumberInput.value
                );


            pages.forEach(function (page, index) {


                const pageNumber =
                    startingNumber + index;


                const text =
                    String(pageNumber);


                const fontSize = 12;


                const { width, height } =
                    page.getSize();


                const textWidth =
                    font.widthOfTextAtSize(
                        text,
                        fontSize
                    );


                let x = 0;

                let y = 25;


                if (
                    position === "bottom-center"
                ) {

                    x =
                        (width - textWidth) / 2;

                }


                else if (
                    position === "bottom-left"
                ) {

                    x = 25;

                }


                else if (
                    position === "bottom-right"
                ) {

                    x =
                        width - textWidth - 25;

                }


                else if (
                    position === "top-center"
                ) {

                    x =
                        (width - textWidth) / 2;

                    y =
                        height - 40;

                }


                page.drawText(
                    text,
                    {
                        x: x,
                        y: y,
                        size: fontSize,
                        font: font,
                        color: PDFLib.rgb(
                            0,
                            0,
                            0
                        )
                    }
                );

            });


            const numberedPdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(
                    [numberedPdfBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "numbered.pdf";


            downloadLink.textContent =
                "download numbered PDF";


            downloadLink.style.display =
                "block";


            pageNumberButton.textContent =
                "add page numbers";


            pageNumberButton.disabled =
                false;


        } catch (error) {


            console.error(
                "Page numbering error:",
                error
            );


            alert(
                "Something went wrong. Check the browser console for details."
            );


            pageNumberButton.textContent =
                "add page numbers";


            pageNumberButton.disabled =
                false;

        }

    }
);