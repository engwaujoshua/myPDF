const pdfInput =
    document.getElementById("pdf-file");

const passwordInput =
    document.getElementById("pdf-password");

const protectButton =
    document.getElementById("protect-button");

const protectionStatus =
    document.getElementById("protection-status");


let selectedFile = null;


// When PDF is selected
pdfInput.addEventListener(
    "change",
    function () {

        selectedFile =
            pdfInput.files[0];

        updateButton();

    }
);


// When password is typed
passwordInput.addEventListener(
    "input",
    function () {

        updateButton();

    }
);


// Enable/disable button
function updateButton() {

    if (

        selectedFile &&

        passwordInput.value.trim() !== ""

    ) {

        protectButton.disabled =
            false;

    } else {

        protectButton.disabled =
            true;

    }

}


// Protect PDF
protectButton.addEventListener(
    "click",
    async function () {


        console.log(
            "Protect button clicked"
        );


        try {


            protectButton.disabled =
                true;


            protectButton.textContent =
                "protecting...";


            protectionStatus.textContent =
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

                    "http://localhost:3000/protect-pdf",

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

                throw new Error(
                    "Server failed to protect the PDF."
                );

            }


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
                "protected-document.pdf";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );


            protectionStatus.textContent =
                "PDF protected successfully.";


            protectButton.textContent =
                "protect PDF";


            updateButton();


        } catch (error) {


            console.error(
                error
            );


            alert(
                error.message
            );


            protectionStatus.textContent =
                "";


            protectButton.textContent =
                "protect PDF";


            updateButton();

        }

    }
);