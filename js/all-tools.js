const searchInput =
    document.getElementById(
        "tool-search"
    );


const toolCategories =
    document.querySelectorAll(
        ".tool-category"
    );


searchInput.addEventListener(
    "input",
    function () {


        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        toolCategories.forEach(

            function (category) {


                const tools =
                    category.querySelectorAll(
                        ".tool-button"
                    );


                let categoryHasMatch =
                    false;


                tools.forEach(

                    function (tool) {


                        const toolName =
                            tool.textContent
                                .toLowerCase();


                        if (

                            toolName.includes(
                                searchTerm
                            )

                        ) {


                            tool.style.display =
                                "flex";


                            categoryHasMatch =
                                true;


                        } else {


                            tool.style.display =
                                "none";

                        }

                    }

                );


                if (
                    categoryHasMatch
                ) {


                    category.style.display =
                        "block";


                } else {


                    category.style.display =
                        "none";

                }

            }

        );

    }

);