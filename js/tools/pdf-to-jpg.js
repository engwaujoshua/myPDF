const pdfInput = document.getElementById("pdf-file");

const convertButton =
    document.getElementById("convert-button");

const downloadAllButton =
    document.getElementById("download-all-button");

const imageResults =
    document.getElementById("image-results");


let selectedFile = null;

let convertedImages = [];


// Select PDF
pdfInput.addEventListener("change", function () {

    selectedFile = pdfInput.files[0];

    imageResults.innerHTML = "";

    convertedImages = [];

    downloadAllButton.style.display = "none";


    if (selectedFile) {

        convertButton.disabled = false;

    } else {

        convertButton.disabled = true;

    }

});


// Convert PDF to JPG
convertButton.addEventListener("click", async function () {

    try {

        convertButton.disabled = true;

        convertButton.textContent = "converting...";


        imageResults.innerHTML = "";

        convertedImages = [];


        const fileBytes =
            await selectedFile.arrayBuffer();


        const pdf =
            await pdfjsLib.getDocument({

                data: fileBytes

            }).promise;


        for (

            let pageNumber = 1;

            pageNumber <= pdf.numPages;

            pageNumber++

        ) {


            const page =
                await pdf.getPage(pageNumber);


            const scale = 2;


            const viewport =
                page.getViewport({

                    scale: scale

                });


            const canvas =
                document.createElement("canvas");


            const context =
                canvas.getContext("2d");


            canvas.width =
                viewport.width;


            canvas.height =
                viewport.height;


            await page.render({

                canvasContext: context,

                viewport: viewport

            }).promise;


            const imageData =
                canvas.toDataURL(

                    "image/jpeg",

                    0.9

                );


            convertedImages.push({

                name: `page-${pageNumber}.jpg`,

                data: imageData

            });


            const result =
                document.createElement("div");


            result.classList.add("image-result");


            result.innerHTML = `

                <img

                    src="${imageData}"

                    alt="Page ${pageNumber}"

                >

                <a

                    href="${imageData}"

                    download="page-${pageNumber}.jpg"

                >

                    download page ${pageNumber}

                </a>

            `;


            imageResults.appendChild(result);

        }


        downloadAllButton.style.display =
            "block";


        convertButton.textContent =
            "convert to JPG";

        convertButton.disabled =
            false;


    } catch (error) {

        console.error(error);


        alert(

            "Something went wrong while converting the PDF."

        );


        convertButton.textContent =
            "convert to JPG";

        convertButton.disabled =
            false;

    }

});


// Download all images
downloadAllButton.addEventListener(

    "click",

    async function () {


        try {


            downloadAllButton.textContent =
                "creating ZIP...";


            const zip =
                new JSZip();


            convertedImages.forEach(function (image) {


                const base64Data =
                    image.data.split(",")[1];


                zip.file(

                    image.name,

                    base64Data,

                    {

                        base64: true

                    }

                );

            });


            const zipBlob =
                await zip.generateAsync({

                    type: "blob"

                });


            const url =
                URL.createObjectURL(zipBlob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "pdf-images.zip";


            link.click();


            URL.revokeObjectURL(url);


            downloadAllButton.textContent =
                "download all JPGs";


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while creating the ZIP file."

            );


            downloadAllButton.textContent =
                "download all JPGs";

        }

    }

);