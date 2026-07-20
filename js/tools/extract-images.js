const pdfInput =
    document.getElementById("pdf-file");

const extractButton =
    document.getElementById("extract-button");

const downloadAllButton =
    document.getElementById("download-all-button");

const imageResults =
    document.getElementById("image-results");


let selectedFile = null;

let extractedImages = [];


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {


        selectedFile =
            pdfInput.files[0];


        imageResults.innerHTML =
            "";


        extractedImages =
            [];


        downloadAllButton.style.display =
            "none";


        extractButton.disabled =
            !selectedFile;

    }
);


// Extract images
extractButton.addEventListener(
    "click",
    async function () {


        try {


            extractButton.disabled =
                true;


            extractButton.textContent =
                "extracting...";


            imageResults.innerHTML =
                "";


            extractedImages =
                [];


            const fileBytes =
                await selectedFile.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({

                    data: fileBytes

                }).promise;


            let imageNumber =
                0;


            for (

                let pageNumber = 1;

                pageNumber <= pdf.numPages;

                pageNumber++

            ) {


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const operatorList =
                    await page.getOperatorList();


                for (

                    let i = 0;

                    i < operatorList.fnArray.length;

                    i++

                ) {


                    const operation =
                        operatorList.fnArray[i];


                    if (

                        operation ===
                        pdfjsLib.OPS.paintImageXObject

                        ||

                        operation ===
                        pdfjsLib.OPS.paintJpegXObject

                    ) {


                        const imageName =
                            operatorList.argsArray[i][0];


                        const image =
                            await page.objs
                                .get(imageName);


                        if (!image) {

                            continue;

                        }


                        imageNumber++;


                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            image.width;


                        canvas.height =
                            image.height;


                        const context =
                            canvas.getContext(
                                "2d"
                            );


                        const imageData =
                            context.createImageData(

                                image.width,

                                image.height

                            );


                        imageData.data.set(
                            image.data
                        );


                        context.putImageData(

                            imageData,

                            0,

                            0

                        );


                        const dataUrl =
                            canvas.toDataURL(
                                "image/png"
                            );


                        extractedImages.push({

                            name:
                                `image-${imageNumber}.png`,

                            data:
                                dataUrl

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

                                src="${dataUrl}"

                                alt="Extracted image"

                            >

                            <a

                                href="${dataUrl}"

                                download="image-${imageNumber}.png"

                            >

                                download image ${imageNumber}

                            </a>

                        `;


                        imageResults.appendChild(
                            result
                        );

                    }

                }

            }


            if (
                extractedImages.length === 0
            ) {


                imageResults.innerHTML = `

                    <p>
                        No embedded images were found in this PDF.
                    </p>

                `;


            } else {


                downloadAllButton.style.display =
                    "block";

            }


            extractButton.textContent =
                "extract images";


            extractButton.disabled =
                false;


        } catch (error) {

            console.error(error);

            alert(

                "Extraction error: " + error.message

            );

            extractButton.textContent =
            "extract images";

            extractButton.disabled =
            false;

        }
    }
);


// Download all images
downloadAllButton.addEventListener(
    "click",
    async function () {


        try {


            downloadAllButton.textContent =
                "creating ZIP...";


            const zip =
                new JSZip();


            extractedImages.forEach(
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
                "extracted-images.zip";


            link.click();


            URL.revokeObjectURL(
                url
            );


            downloadAllButton.textContent =
                "download all images";


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while creating the ZIP file."

            );


            downloadAllButton.textContent =
                "download all images";

        }

    }
);