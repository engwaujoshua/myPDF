const pdfInput =
    document.getElementById("pdf-file");

const watermarkText =
    document.getElementById("watermark-text");

const watermarkPosition =
    document.getElementById("watermark-position");

const watermarkOpacity =
    document.getElementById("watermark-opacity");

const watermarkButton =
    document.getElementById("watermark-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    updateButton();

});


// Update button state
watermarkText.addEventListener(
    "input",
    updateButton
);


function updateButton() {

    watermarkButton.disabled =
        !selectedFile ||
        watermarkText.value.trim() === "";

}


// Add watermark
watermarkButton.addEventListener(
    "click",
    async function () {

        try {


            watermarkButton.disabled =
                true;


            watermarkButton.textContent =
                "adding watermark...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdfDoc =
                await PDFLib.PDFDocument.load(
                    fileBytes
                );


            const pages =
                pdfDoc.getPages();


            const text =
                watermarkText.value;


            const opacity =
                Number(
                    watermarkOpacity.value
                );


            const position =
                watermarkPosition.value;


            const font =
                await pdfDoc.embedFont(
                    PDFLib.StandardFonts.Helvetica
                );


            pages.forEach(function (page) {


                const { width, height } =
                    page.getSize();


                const fontSize =
                    Math.min(

                        width / text.length * 1.5,

                        60

                    );


                const textWidth =
                    font.widthOfTextAtSize(

                        text,

                        fontSize

                    );


                let x;


                let y;


                if (
                    position === "center"
                ) {


                    x =
                        (width - textWidth) / 2;


                    y =
                        (height - fontSize) / 2;


                }


                if (
                    position === "top"
                ) {


                    x =
                        (width - textWidth) / 2;


                    y =
                        height - 80;


                }


                if (
                    position === "bottom"
                ) {


                    x =
                        (width - textWidth) / 2;


                    y =
                        50;


                }


                page.drawText(

                    text,

                    {

                        x: x,

                        y: y,

                        size: fontSize,

                        font: font,

                        color: PDFLib.rgb(

                            0.5,

                            0.5,

                            0.5

                        ),

                        opacity: opacity

                    }

                );

            });


            const watermarkedPdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(

                    [watermarkedPdfBytes],

                    {

                        type: "application/pdf"

                    }

                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "watermarked.pdf";


            downloadLink.textContent =
                "download watermarked PDF";


            downloadLink.style.display =
                "block";


            watermarkButton.textContent =
                "add watermark";


            watermarkButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while adding the watermark."

            );


            watermarkButton.textContent =
                "add watermark";


            watermarkButton.disabled =
                false;

        }

    }

);