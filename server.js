const express = require("express");

const multer = require("multer");

const cors = require("cors");

const fs = require("fs");

const path = require("path");

const { execFile } =
    require("child_process");


const app =
    express();


const upload =
    multer({

        dest: "uploads/"

    });


app.use(
    cors()
);


app.use(
    express.json()
);


app.post(

    "/protect-pdf",

    upload.single("pdf"),

    function (req, res) {


        const inputFile =
            req.file.path;


        const password =
            req.body.password;


        const outputFile =
            path.join(

                "uploads",

                `protected-${Date.now()}.pdf`

            );


        if (
            !password
        ) {


            fs.unlinkSync(
                inputFile
            );


            return res.status(400).json({

                error:
                    "Password is required."

            });

        }


        execFile(

            "qpdf",

            [

                "--encrypt",

                password,

                password,

                "256",

                "--",

                inputFile,

                outputFile

            ],

            function (error) {


                fs.unlinkSync(
                    inputFile
                );


                if (
                    error
                ) {


                    console.error(
                        error
                    );


                    return res.status(500).json({

                        error:
                            "Could not protect PDF."

                    });

                }


                res.download(

                    outputFile,

                    "protected-document.pdf",

                    function () {


                        fs.unlink(

                            outputFile,

                            function () {}

                        );

                    }

                );

            }

        );

    }

);


app.post(

    "/unlock-pdf",

    upload.single("pdf"),

    function (req, res) {


        const inputFile =
            req.file.path;


        const password =
            req.body.password;


        const outputFile =
            path.join(

                "uploads",

                `unlocked-${Date.now()}.pdf`

            );


        if (
            !password
        ) {


            fs.unlinkSync(
                inputFile
            );


            return res.status(400).json({

                error:
                    "Password is required."

            });

        }


        execFile(

            "qpdf",

            [

                "--password=" + password,

                "--decrypt",

                inputFile,

                outputFile

            ],

            function (error) {


                fs.unlinkSync(
                    inputFile
                );


                if (
                    error
                ) {


                    console.error(
                        error
                    );


                    return res.status(400).json({

                        error:
                            "Incorrect password or invalid PDF."

                    });

                }


                res.download(

                    outputFile,

                    "unlocked-document.pdf",

                    function () {


                        fs.unlink(

                            outputFile,

                            function () {}

                        );

                    }

                );

            }

        );

    }

);

app.listen(

    3000,

    function () {


        console.log(

            "PDF server running on http://localhost:3000"

        );

    }

);