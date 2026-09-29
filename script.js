document.addEventListener("DOMContentLoaded", function () {

    const categorySection =
        document.querySelector(".mp-category-section");

    if (!categorySection) {
        return;
    }

    const placeholder =
        document.createElement("div");

    placeholder.className =
        "mp-category-section-placeholder";

    categorySection.parentNode.insertBefore(
        placeholder,
        categorySection
    );

    let categoryTop = 0;

    // Check if current screen is mobile/tablet
    function isMobileOrTablet() {
        return window.innerWidth <= 1024;
    }

    function calculateCategoryPosition() {

        categorySection.classList.remove("is-sticky");

        placeholder.classList.remove("active");
        placeholder.style.height = "0px";

        categoryTop =
            categorySection.getBoundingClientRect().top +
            window.scrollY;
    }

    function handleCategorySticky() {

        // Laptop/Desktop: remove sticky completely
        if (!isMobileOrTablet()) {

            categorySection.classList.remove(
                "is-sticky"
            );

            placeholder.classList.remove(
                "active"
            );

            placeholder.style.height = "0px";

            return;
        }

        const scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        if (scrollTop >= categoryTop) {

            if (!categorySection.classList.contains("is-sticky")) {

                const sectionHeight =
                    categorySection.offsetHeight;

                placeholder.style.height =
                    sectionHeight + "px";

                placeholder.classList.add("active");

                categorySection.classList.add(
                    "is-sticky"
                );
            }

        } else {

            categorySection.classList.remove(
                "is-sticky"
            );

            placeholder.classList.remove(
                "active"
            );

            placeholder.style.height = "0px";
        }
    }

    // Initial calculation
    calculateCategoryPosition();

    // Scroll event
    window.addEventListener(
        "scroll",
        handleCategorySticky,
        { passive: true }
    );

    // Resize event
    window.addEventListener(
        "resize",
        function () {

            calculateCategoryPosition();

            handleCategorySticky();
        }
    );

    // Initial check
    handleCategorySticky();

});

document.addEventListener("DOMContentLoaded", function () {

    const customModal =
        document.getElementById("mpCustomModal");

    const customClose =
        document.getElementById("mpCustomClose");

    const customCancel =
        document.getElementById("mpCustomCancel");

    const customAdd =
        document.getElementById("mpCustomAdd");

    const customProductName =
        document.getElementById("mpCustomProductName");

    const customQuantity =
        document.getElementById("mpCustomQuantity");

    const customPrice =
        document.getElementById("mpCustomPrice");


    let currentCustomButton = null;


    /* =========================
       Open Custom Modal
    ========================= */

    document.addEventListener("click", function (event) {

        const customButton =
            event.target.closest(".mp-custom-option");

        if (!customButton) {
            return;
        }

        currentCustomButton = customButton;

        const productName =
            customButton.dataset.product || "Product";

        customProductName.textContent =
            productName;

        customQuantity.value = "";
        customPrice.value = "";

        customModal.classList.add("active");

        document.body.style.overflow = "hidden";

        setTimeout(function () {
            customQuantity.focus();
        }, 200);

    });


    /* =========================
       Close Modal
    ========================= */

    function closeCustomModal() {

        customModal.classList.remove("active");

        document.body.style.overflow = "";

        currentCustomButton = null;
    }


    customClose.addEventListener(
        "click",
        closeCustomModal
    );


    customCancel.addEventListener(
        "click",
        closeCustomModal
    );


    /* =========================
       Add Custom Option
    ========================= */

    customAdd.addEventListener(
        "click",
        function () {

            const quantity =
                customQuantity.value.trim();

            const price =
                customPrice.value.trim();

            if (!quantity) {

                alert("Please enter quantity.");

                customQuantity.focus();

                return;
            }

            if (!price) {

                alert("Please enter price.");

                customPrice.focus();

                return;
            }


            if (currentCustomButton) {

                currentCustomButton.textContent =
                    quantity;

                currentCustomButton.classList.add(
                    "active"
                );

                currentCustomButton.dataset.quantity =
                    quantity;

                currentCustomButton.dataset.price =
                    price;
            }


            /* Update product price */

            const productCard =
                currentCustomButton.closest(
                    ".mp-product"
                );

            if (productCard) {

                const priceElement =
                    productCard.querySelector(
                        ".mp-price"
                    );

                if (priceElement) {

                    priceElement.textContent =
                        "₹" + price;
                }
            }


            closeCustomModal();

        }
    );


    /* =========================
       Close on Overlay Click
    ========================= */

    customModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === customModal
            ) {
                closeCustomModal();
            }

        }
    );


    /* =========================
       Close with ESC
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                customModal.classList.contains("active")
            ) {
                closeCustomModal();
            }

        }
    );

});


document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("click", function (event) {

        const sizeButton =
            event.target.closest(".mp-size-option");

        if (!sizeButton) {
            return;
        }

        if (
            sizeButton.classList.contains(
                "mp-custom-option"
            )
        ) {
            return;
        }

        const product =
            sizeButton.closest(".mp-product");

        if (!product) {
            return;
        }


        // Remove active
        product
            .querySelectorAll(".mp-size-option")
            .forEach(function (option) {

                option.classList.remove("active");

            });


        // Set active
        sizeButton.classList.add("active");


        // Get price
        const price =
            sizeButton.dataset.price;


        // Update current price
        const currentPrice =
            product.querySelector(
                ".mp-current-price"
            );

        if (currentPrice) {

            currentPrice.textContent =
                "₹" + price;

        }

    });

});
