const pdfInput =
    document.getElementById("pdf-file");

const convertButton =
    document.getElementById("convert-button");

const conversionStatus =
    document.getElementById(
        "conversion-status"
    );


let selectedFile = null;


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {

        selectedFile =
            pdfInput.files[0];

        convertButton.disabled =
            !selectedFile;

        conversionStatus.textContent =
            "";

    }
);


// Convert PDF to Word
convertButton.addEventListener(
    "click",
    async function () {

        try {

            convertButton.disabled =
                true;

            convertButton.textContent =
                "converting...";


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({

                    data: fileBytes

                }).promise;


            const wordParagraphs =
                [];


            for (

                let pageNumber = 1;

                pageNumber <= pdf.numPages;

                pageNumber++

            ) {


                conversionStatus.textContent =

                    `Processing page ${pageNumber} of ${pdf.numPages}...`;


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const textContent =
                    await page.getTextContent();


                const items =
                    textContent.items;


                let currentLine =
                    "";


                let previousY =
                    null;


                items.forEach(
                    function (item) {


                        const currentY =
                            item.transform[5];


                        if (

                            previousY !== null &&

                            Math.abs(

                                currentY -
                                previousY

                            ) > 5

                        ) {


                            if (
                                currentLine.trim()
                            ) {


                                wordParagraphs.push(

                                    new docx.Paragraph({

                                        text:
                                            currentLine.trim(),

                                        spacing: {

                                            after: 120

                                        }

                                    })

                                );

                            }


                            currentLine =
                                "";

                        }


                        currentLine +=
                            item.str + " ";


                        previousY =
                            currentY;

                    }
                );


                if (
                    currentLine.trim()
                ) {


                    wordParagraphs.push(

                        new docx.Paragraph({

                            text:
                                currentLine.trim(),

                            spacing: {

                                after: 120

                            }

                        })

                    );

                }


                wordParagraphs.push(

                    new docx.Paragraph({

                        text:
                            `Page ${pageNumber}`,

                        pageBreakBefore:
                            true

                    })

                );

            }


            conversionStatus.textContent =
                "Creating Word document...";


            const document =
                new docx.Document({

                    sections: [

                        {

                            children:
                                wordParagraphs

                        }

                    ]

                });


            const blob =
                await docx.Packer.toBlob(
                    document
                );


            saveAs(

                blob,

                "converted-document.docx"

            );


            conversionStatus.textContent =
                "Conversion completed successfully.";


            convertButton.textContent =
                "convert to Word";


            convertButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while converting the PDF."

            );


            conversionStatus.textContent =
                "";


            convertButton.textContent =
                "convert to Word";


            convertButton.disabled =
                false;

        }

    }
);