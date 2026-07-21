const pdfInput =
    document.getElementById("pdf-file");

const extractButton =
    document.getElementById("extract-button");

const textOutput =
    document.getElementById("text-output");

const copyButton =
    document.getElementById("copy-button");

const downloadButton =
    document.getElementById("download-button");


let selectedFile = null;


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {


        selectedFile =
            pdfInput.files[0];


        extractButton.disabled =
            !selectedFile;


        textOutput.value =
            "";


        copyButton.style.display =
            "none";


        downloadButton.style.display =
            "none";

    }
);


// Extract text
extractButton.addEventListener(
    "click",
    async function () {


        try {


            extractButton.disabled =
                true;


            extractButton.textContent =
                "extracting...";


            textOutput.value =
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


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const textContent =
                    await page.getTextContent();


                const pageText =
                    textContent.items

                        .map(
                            function (item) {

                                return item.str;

                            }
                        )

                        .join(" ");


                fullText +=

                    `\n\n--- Page ${pageNumber} ---\n\n`

                    +

                    pageText;

            }


            textOutput.value =
                fullText.trim();


            copyButton.style.display =
                "inline-block";


            downloadButton.style.display =
                "inline-block";


            extractButton.textContent =
                "extract text";


            extractButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while extracting the text."

            );


            extractButton.textContent =
                "extract text";


            extractButton.disabled =
                false;

        }

    }
);


// Copy text
copyButton.addEventListener(
    "click",
    async function () {


        try {


            await navigator.clipboard.writeText(

                textOutput.value

            );


            copyButton.textContent =
                "copied";


            setTimeout(
                function () {

                    copyButton.textContent =
                        "copy text";

                },

                1500

            );


        } catch (error) {


            console.error(error);


            alert(
                "Could not copy the text."
            );

        }

    }
);


// Download text
downloadButton.addEventListener(
    "click",
    function () {


        const blob =
            new Blob(

                [textOutput.value],

                {

                    type: "text/plain"

                }

            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "extracted-text.txt";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);