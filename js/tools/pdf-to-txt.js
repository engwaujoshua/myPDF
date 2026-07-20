const pdfInput =
    document.getElementById("pdf-file");

const extractButton =
    document.getElementById("extract-button");

const textOutput =
    document.getElementById("text-output");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;

let extractedText = "";


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    textOutput.value = "";

    extractedText = "";

    downloadLink.style.display = "none";


    extractButton.disabled =
        !selectedFile;

});


// Extract text
extractButton.addEventListener(
    "click",
    async function () {

        try {


            extractButton.disabled =
                true;


            extractButton.textContent =
                "extracting...";


            textOutput.value = "";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({

                    data: fileBytes

                }).promise;


            let allText = "";


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

                        .map(function (item) {

                            return item.str;

                        })

                        .join(" ");


                allText +=

                    `\n\n--- Page ${pageNumber} ---\n\n`;


                allText += pageText;

            }


            extractedText =
                allText.trim();


            textOutput.value =
                extractedText;


            const textBlob =
                new Blob(

                    [extractedText],

                    {

                        type: "text/plain"

                    }

                );


            const url =
                URL.createObjectURL(textBlob);


            downloadLink.href =
                url;


            downloadLink.download =
                "extracted-text.txt";


            downloadLink.textContent =
                "download TXT file";


            downloadLink.style.display =
                "block";


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