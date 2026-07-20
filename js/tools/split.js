const pdfInput =
    document.getElementById("pdf-file");

const pageList =
    document.getElementById("page-list");

const splitButton =
    document.getElementById("split-button");

const downloadLink =
    document.getElementById("download-link");


let selectedFile = null;

let originalPdf = null;

let selectedPages = [];


// Select PDF
pdfInput.addEventListener("change", async function () {

    selectedFile = pdfInput.files[0];

    pageList.innerHTML = "";

    selectedPages = [];


    if (!selectedFile) {

        splitButton.disabled = true;

        return;

    }


    try {


        const fileBytes =
            await selectedFile.arrayBuffer();


        originalPdf =
            await PDFLib.PDFDocument.load(fileBytes);


        const pageCount =
            originalPdf.getPageCount();


        for (
            let pageIndex = 0;
            pageIndex < pageCount;
            pageIndex++
        ) {


            const pageItem =
                document.createElement("label");


            pageItem.classList.add(
                "page-item"
            );


            pageItem.innerHTML = `

                <input
                    type="checkbox"
                    value="${pageIndex}"
                >

                <span>
                    page ${pageIndex + 1}
                </span>

            `;


            pageList.appendChild(pageItem);

        }


        pageList
            .querySelectorAll("input")
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    updateSelectedPages
                );

            });


    } catch (error) {


        console.error(error);


        alert(
            "Could not read this PDF."
        );

    }

});


// Update selected pages
function updateSelectedPages() {

    selectedPages = Array.from(

        pageList.querySelectorAll(
            "input:checked"
        )

    ).map(function (checkbox) {

        return Number(checkbox.value);

    });


    splitButton.disabled =
        selectedPages.length === 0;

}


// Create new PDF
splitButton.addEventListener(
    "click",
    async function () {

        try {


            splitButton.disabled =
                true;


            splitButton.textContent =
                "creating PDF...";


            const newPdf =
                await PDFLib.PDFDocument.create();


            const copiedPages =
                await newPdf.copyPages(

                    originalPdf,

                    selectedPages

                );


            copiedPages.forEach(function (page) {

                newPdf.addPage(page);

            });


            const pdfBytes =
                await newPdf.save();


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
                "split.pdf";


            downloadLink.textContent =
                "download PDF";


            downloadLink.style.display =
                "block";


            splitButton.textContent =
                "create new PDF";


            splitButton.disabled =
                false;


        } catch (error) {


            console.error(error);


            alert(

                "Something went wrong while splitting the PDF."

            );


            splitButton.textContent =
                "create new PDF";


            splitButton.disabled =
                false;

        }

    }

);