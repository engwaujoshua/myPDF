const wordInput =
    document.getElementById("word-file");

const convertButton =
    document.getElementById("convert-button");

const conversionStatus =
    document.getElementById(
        "conversion-status"
    );

const documentPreview =
    document.getElementById(
        "document-preview"
    );


let selectedFile = null;


// Select Word file
wordInput.addEventListener(
    "change",
    function () {


        selectedFile =
            wordInput.files[0];


        convertButton.disabled =
            !selectedFile;


        conversionStatus.textContent =
            "";

    }
);


// Convert Word to PDF
convertButton.addEventListener(
    "click",
    async function () {


        try {


            convertButton.disabled =
                true;


            convertButton.textContent =
                "converting...";


            conversionStatus.textContent =
                "Reading Word document...";


            const arrayBuffer =
                await selectedFile.arrayBuffer();


            const result =
                await mammoth.convertToHtml({

                    arrayBuffer:
                        arrayBuffer

                });


            documentPreview.innerHTML =
                result.value;


            documentPreview.style.display =
                "block";


            conversionStatus.textContent =
                "Creating PDF...";


            const options = {


                margin:
                    0.5,


                filename:
                    "converted-document.pdf",


                image: {

                    type:
                        "jpeg",

                    quality:
                        0.98

                },


                html2canvas: {

                    scale:
                        2

                },


                jsPDF: {

                    unit:
                        "in",

                    format:
                        "a4",

                    orientation:
                        "portrait"

                }

            };


            await html2pdf()

                .set(options)

                .from(documentPreview)

                .save();


            conversionStatus.textContent =
                "Conversion completed successfully.";


            convertButton.textContent =
                "convert to PDF";


            convertButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while converting the Word document."

            );


            conversionStatus.textContent =
                "";


            convertButton.textContent =
                "convert to PDF";


            convertButton.disabled =
                false;

        }

    }
);