const pdfInput =
    document.getElementById("pdf-file");

const pageSelection =
    document.getElementById("page-selection");

const customPages =
    document.getElementById("custom-pages");

const imageScale =
    document.getElementById("image-scale");

const convertButton =
    document.getElementById("convert-button");

const downloadAllButton =
    document.getElementById("download-all-button");

const imageResults =
    document.getElementById("image-results");


let selectedFile = null;

let convertedImages = [];


// Show/hide custom pages
pageSelection.addEventListener(
    "change",
    function () {


        if (
            pageSelection.value === "custom"
        ) {

            customPages.style.display =
                "block";

        } else {

            customPages.style.display =
                "none";

        }

    }
);


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {


        selectedFile =
            pdfInput.files[0];


        imageResults.innerHTML =
            "";


        convertedImages =
            [];


        downloadAllButton.style.display =
            "none";


        convertButton.disabled =
            !selectedFile;

    }
);


// Convert PDF to PNG
convertButton.addEventListener(
    "click",
    async function () {


        try {


            convertButton.disabled =
                true;


            convertButton.textContent =
                "converting...";


            imageResults.innerHTML =
                "";


            convertedImages =
                [];


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({

                    data: fileBytes

                }).promise;


            let pagesToConvert = [];


            if (
                pageSelection.value === "all"
            ) {


                for (

                    let i = 1;

                    i <= pdf.numPages;

                    i++

                ) {

                    pagesToConvert.push(i);

                }

            } else {


                pagesToConvert =
                    parsePageSelection(

                        customPages.value,

                        pdf.numPages

                    );

            }


            if (
                pagesToConvert.length === 0
            ) {

                throw new Error(
                    "No valid pages selected."
                );

            }


            for (
                const pageNumber
                of pagesToConvert
            ) {


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const scale =
                    Number(
                        imageScale.value
                    );


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


                const imageName =
                    `page-${pageNumber}.png`;


                convertedImages.push({

                    name:
                        imageName,

                    data:
                        imageData

                });


                const result =
                    document.createElement(
                        "div"
                    );


                result.classList.add(
                    "image-result"
                );


                result.innerHTML = `

                    <img

                        src="${imageData}"

                        alt="Page ${pageNumber}"

                    >

                    <a

                        href="${imageData}"

                        download="${imageName}"

                    >

                        download page ${pageNumber}

                    </a>

                `;


                imageResults.appendChild(
                    result
                );

            }


            downloadAllButton.style.display =
                "block";


            convertButton.textContent =
                "convert to PNG";


            convertButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while converting the PDF."

            );


            convertButton.textContent =
                "convert to PNG";


            convertButton.disabled =
                false;

        }

    }
);


// Parse page selection
function parsePageSelection(
    input,
    maxPage
) {


    const pages =
        new Set();


    const parts =
        input.split(",");


    parts.forEach(
        function (part) {


            part =
                part.trim();


            if (
                part.includes("-")
            ) {


                const range =
                    part.split("-");


                const start =
                    Number(
                        range[0]
                    );


                const end =
                    Number(
                        range[1]
                    );


                for (

                    let i = start;

                    i <= end;

                    i++

                ) {


                    if (
                        i >= 1 &&
                        i <= maxPage
                    ) {

                        pages.add(i);

                    }

                }

            } else {


                const page =
                    Number(part);


                if (
                    page >= 1 &&
                    page <= maxPage
                ) {

                    pages.add(page);

                }

            }

        }
    );


    return Array.from(pages).sort(

        function (a, b) {

            return a - b;

        }

    );

}


// Download all PNGs
downloadAllButton.addEventListener(
    "click",
    async function () {


        try {


            downloadAllButton.textContent =
                "creating ZIP...";


            const zip =
                new JSZip();


            convertedImages.forEach(
                function (image) {


                    const base64Data =
                        image.data.split(",")[1];


                    zip.file(

                        image.name,

                        base64Data,

                        {

                            base64: true

                        }

                    );

                }
            );


            const zipBlob =
                await zip.generateAsync({

                    type: "blob"

                });


            const url =
                URL.createObjectURL(
                    zipBlob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "pdf-pages.zip";


            link.click();


            URL.revokeObjectURL(
                url
            );


            downloadAllButton.textContent =
                "download all PNGs";


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while creating the ZIP file."

            );


            downloadAllButton.textContent =
                "download all PNGs";

        }

    }
);