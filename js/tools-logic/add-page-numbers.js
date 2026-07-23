const pdfInput = document.getElementById("pdf-file");
const addNumbersButton = document.getElementById("add-numbers-button");
const numbersStatus = document.getElementById("numbers-status");

addNumbersButton.addEventListener("click", async () => {
    const file = pdfInput.files[0];

    if (!file) {
        numbersStatus.textContent = "Please select a PDF file.";
        return;
    }

    try {
        numbersStatus.textContent = "Adding page numbers...";

        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(fileBytes);
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        pages.forEach((page, index) => {
            const { width } = page.getSize();

            page.drawText(`${index + 1}`, {
                x: width / 2 - 5,
                y: 20,
                size: 12,
                font
            });
        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "numbered.pdf";
        link.click();

        URL.revokeObjectURL(url);

        numbersStatus.textContent = "Page numbers added successfully.";
    } catch (error) {
        console.error("PAGE NUMBERS ERROR:", error);
        numbersStatus.textContent = error.message;
    }
});