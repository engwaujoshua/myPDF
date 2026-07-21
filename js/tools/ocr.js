const pdfInput =
    document.getElementById("pdf-file");

const ocrButton =
    document.getElementById("ocr-button");

const ocrStatus =
    document.getElementById("ocr-status");

const ocrOutput =
    document.getElementById("ocr-output");

const downloadButton =
    document.getElementById("download-button");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {

        selectedFile =
            pdfInput.files[0];

        ocrButton.disabled =
            !selectedFile;

        ocrOutput.value =
            "";

        ocrStatus.textContent =
            "";

        downloadButton.style.display =
            "none";

    }
);


// Run OCR
ocrButton.addEventListener(
    "click",
    async function () {

        try {

            ocrButton.disabled =
                true;

            ocrButton.textContent =
                "processing...";

            ocrOutput.value =
                "";

            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({

                    data: fileBytes

                }).promise;


            let fullText =
                "";


            for (

                let pageNumber = 1;

                pageNumber <= pdf.numPages;

                pageNumber++

            ) {


                ocrStatus.textContent =
                    `Processing page ${pageNumber} of ${pdf.numPages}...`;


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const scale =
                    2;


                const viewport =
                    page.getViewport({

                        scale: scale

                    });


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                const context =
                    canvas.getContext(
                        "2d"
                    );


                canvas.width =
                    viewport.width;


                canvas.height =
                    viewport.height;


                await page.render({

                    canvasContext:
                        context,

                    viewport:
                        viewport

                }).promise;


                const imageData =
                    canvas.toDataURL(
                        "image/png"
                    );


                const result =
                    await Tesseract.recognize(

                        imageData,

                        "eng",

                        {

                            logger:
                                function (message) {


                                    if (
                                        message.status ===
                                        "recognizing text"
                                    ) {


                                        const progress =
                                            Math.round(

                                                message.progress
                                                * 100

                                            );


                                        ocrStatus.textContent =

                                            `Page ${pageNumber}: ${progress}%`;

                                    }

                                }

                        }

                    );


                fullText +=

                    `\n\n--- Page ${pageNumber} ---\n\n`

                    +

                    result.data.text;

            }


            ocrOutput.value =
                fullText.trim();


            downloadButton.style.display =
                "inline-block";


            ocrStatus.textContent =
                "OCR completed successfully.";


            ocrButton.textContent =
                "extract text with OCR";


            ocrButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while running OCR."

            );


            ocrStatus.textContent =
                "";


            ocrButton.textContent =
                "extract text with OCR";


            ocrButton.disabled =
                false;

        }

    }
);


// Download OCR text
downloadButton.addEventListener(
    "click",
    function () {


        const blob =
            new Blob(

                [ocrOutput.value],

                {

                    type: "text/plain"

                }

            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "ocr-text.txt";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);