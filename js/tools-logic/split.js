const pdfInput = document.getElementById("pdf-file");
const pageRangeInput = document.getElementById("page-range");
const splitButton = document.getElementById("split-button");
const splitStatus = document.getElementById("split-status");

splitButton.addEventListener("click", async () => {
    const file = pdfInput.files[0];
    const pageRange = pageRangeInput.value.trim();

    if (!file) {
        splitStatus.textContent = "Please select a PDF file.";
        return;
    }

    if (!pageRange) {
        splitStatus.textContent = "Please enter the page numbers.";
        return;
    }

    try {
        splitStatus.textContent = "Splitting PDF...";

        const fileBytes = await file.arrayBuffer();
        const sourcePdf = await PDFLib.PDFDocument.load(fileBytes);

        const pageIndices = parsePageRange(
            pageRange,
            sourcePdf.getPageCount()
        );

        if (pageIndices.length === 0) {
            throw new Error("No valid pages selected.");
        }

        const newPdf = await PDFLib.PDFDocument.create();

        const copiedPages = await newPdf.copyPages(
            sourcePdf,
            pageIndices
        );

        copiedPages.forEach((page) => {
            newPdf.addPage(page);
        });

        const pdfBytes = await newPdf.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "split.pdf";
        link.click();

        URL.revokeObjectURL(url);

        splitStatus.textContent = "PDF split successfully.";
        } catch (error) {
        console.error("SPLIT ERROR:", error);
        splitStatus.textContent = error.message;
    }
});

function parsePageRange(range, totalPages) {
    const pages = new Set();

    range.split(",").forEach((part) => {
        part = part.trim();

        if (part.includes("-")) {
            const [start, end] = part.split("-").map(Number);

            if (
                Number.isInteger(start) &&
                Number.isInteger(end) &&
                start >= 1 &&
                end <= totalPages &&
                start <= end
            ) {
                for (let page = start; page <= end; page++) {
                    pages.add(page - 1);
                }
            }
        } else {
            const page = Number(part);

            if (
                Number.isInteger(page) &&
                page >= 1 &&
                page <= totalPages
            ) {
                pages.add(page - 1);
            }
        }
    });

    return [...pages].sort((a, b) => a - b);
}