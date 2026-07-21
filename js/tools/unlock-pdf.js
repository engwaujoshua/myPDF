const pdfInput =
    document.getElementById("pdf-file");

const passwordInput =
    document.getElementById("pdf-password");

const unlockButton =
    document.getElementById("unlock-button");

const unlockStatus =
    document.getElementById("unlock-status");


let selectedFile =
    null;


// Select PDF
pdfInput.addEventListener(
    "change",
    function () {

        selectedFile =
            pdfInput.files[0];

        updateButton();

    }
);


// Enter password
passwordInput.addEventListener(
    "input",
    function () {

        updateButton();

    }
);


// Enable button
function updateButton() {

    unlockButton.disabled =

        !(

            selectedFile &&

            passwordInput.value.trim() !== ""

        );

}


// Unlock PDF
unlockButton.addEventListener(
    "click",
    async function () {


        try {


            unlockButton.disabled =
                true;


            unlockButton.textContent =
                "unlocking...";


            unlockStatus.textContent =
                "Uploading PDF...";


            const formData =
                new FormData();


            formData.append(
                "pdf",
                selectedFile
            );


            formData.append(
                "password",
                passwordInput.value
            );


            const response =
                await fetch(

                    "http://localhost:3000/unlock-pdf",

                    {

                        method:
                            "POST",

                        body:
                            formData

                    }

                );


            if (
                !response.ok
            ) {


                const error =
                    await response.json();


                throw new Error(
                    error.error
                );

            }


            unlockStatus.textContent =
                "PDF unlocked successfully. Downloading...";


            const blob =
                await response.blob();


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "unlocked-document.pdf";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );


            unlockStatus.textContent =
                "PDF unlocked successfully.";


            unlockButton.textContent =
                "unlock PDF";


            updateButton();


        } catch (error) {


            console.error(
                error
            );


            alert(
                error.message
            );


            unlockStatus.textContent =
                "";


            unlockButton.textContent =
                "unlock PDF";


            updateButton();

        }

    }
);