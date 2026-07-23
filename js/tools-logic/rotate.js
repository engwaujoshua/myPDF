const pdfInput = document.getElementById("pdf-file");
const rotationAngle = document.getElementById("rotation-angle");
const rotateButton = document.getElementById("rotate-button");
const rotateStatus = document.getElementById("rotate-status");

rotateButton.addEventListener("click", async () => {
    const file = pdfInput.files[0];

    if (!file) {
        rotateStatus.textContent = "Please select a PDF file.";
        return;
    }

    try {
        rotateStatus.textContent = "Rotating PDF...";

        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(fileBytes);

        const angle = Number(rotationAngle.value);

        pdfDoc.getPages().forEach((page) => {
            page.setRotation(
                PDFLib.degrees(page.getRotation().angle + angle)
            );
        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "rotated.pdf";
        link.click();

        URL.revokeObjectURL(url);

        rotateStatus.textContent = "PDF rotated successfully.";
    } catch (error) {
        console.error("ROTATE ERROR:", error);
        rotateStatus.textContent = error.message;
    }
});