const pdfInput = document.getElementById("pdf-files");
const mergeButton = document.getElementById("merge-button");
const mergeStatus = document.getElementById("merge-status");

mergeButton.addEventListener("click", async () => {
    const files = pdfInput.files;

    if (files.length < 2) {
        mergeStatus.textContent = "Please select at least two PDF files.";
        return;
    }

    try {
        mergeStatus.textContent = "Merging PDFs...";

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of files) {
            const fileBytes = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(fileBytes);

            const pages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices()
            );

            pages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const mergedPdfBytes = await mergedPdf.save();

        const blob = new Blob([mergedPdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "merged.pdf";
        link.click();

        URL.revokeObjectURL(url);

        mergeStatus.textContent = "PDFs merged successfully.";
    } catch (error) {
        console.error(error);
        mergeStatus.textContent = "Something went wrong while merging PDFs.";
    }
});