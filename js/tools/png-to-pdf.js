const imageInput =
    document.getElementById("image-files");

const pageSizeInput =
    document.getElementById("page-size");

const imagePreview =
    document.getElementById("image-preview");

const convertButton =
    document.getElementById("convert-button");

const downloadLink =
    document.getElementById("download-link");


let selectedImages = [];


// Select images
imageInput.addEventListener(
    "change",
    function () {


        selectedImages =
            Array.from(
                imageInput.files
            );


        imagePreview.innerHTML =
            "";


        convertButton.disabled =
            selectedImages.length === 0;


        selectedImages.forEach(
            function (image) {


                const imageUrl =
                    URL.createObjectURL(
                        image
                    );


                const preview =
                    document.createElement(
                        "div"
                    );


                preview.classList.add(
                    "png-preview"
                );


                preview.innerHTML = `

                    <img

                        src="${imageUrl}"

                        alt="${image.name}"

                    >

                    <p>
                        ${image.name}
                    </p>

                `;


                imagePreview.appendChild(
                    preview
                );

            }
        );

    }
);


// Convert images to PDF
convertButton.addEventListener(
    "click",
    async function () {


        try {


            convertButton.disabled =
                true;


            convertButton.textContent =
                "creating PDF...";


            const pdfDoc =
                await PDFLib.PDFDocument.create();


            const pageSize =
                pageSizeInput.value;


            for (
                const imageFile
                of selectedImages
            ) {


                const imageBytes =
                    await imageFile.arrayBuffer();


                const pngImage =
                    await pdfDoc.embedPng(
                        imageBytes
                    );


                const imageWidth =
                    pngImage.width;


                const imageHeight =
                    pngImage.height;


                let pageWidth;

                let pageHeight;


                if (
                    pageSize === "a4"
                ) {

                    pageWidth =
                        595.28;

                    pageHeight =
                        841.89;

                }


                else if (
                    pageSize === "letter"
                ) {

                    pageWidth =
                        612;

                    pageHeight =
                        792;

                }


                else {

                    pageWidth =
                        imageWidth;

                    pageHeight =
                        imageHeight;

                }


                const page =
                    pdfDoc.addPage([

                        pageWidth,

                        pageHeight

                    ]);


                let drawWidth =
                    imageWidth;


                let drawHeight =
                    imageHeight;


                if (
                    pageSize !== "fit"
                ) {


                    const scale =
                        Math.min(

                            pageWidth /
                                imageWidth,

                            pageHeight /
                                imageHeight

                        );


                    drawWidth =
                        imageWidth *
                        scale;


                    drawHeight =
                        imageHeight *
                        scale;

                }


                const x =
                    (pageWidth -
                        drawWidth) / 2;


                const y =
                    (pageHeight -
                        drawHeight) / 2;


                page.drawImage(

                    pngImage,

                    {

                        x: x,

                        y: y,

                        width: drawWidth,

                        height: drawHeight

                    }

                );

            }


            const pdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(

                    [pdfBytes],

                    {

                        type: "application/pdf"

                    }

                );


            const url =
                URL.createObjectURL(blob);


            downloadLink.href =
                url;


            downloadLink.download =
                "images.pdf";


            downloadLink.textContent =
                "download PDF";


            downloadLink.style.display =
                "block";


            convertButton.textContent =
                "convert to PDF";


            convertButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while creating the PDF."

            );


            convertButton.textContent =
                "convert to PDF";


            convertButton.disabled =
                false;

        }

    }
);