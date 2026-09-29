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

document.addEventListener("DOMContentLoaded", function () {

    let currentProduct = null;
    let currentBasePrice = 0;

    const modal = document.getElementById("mpCustomModal");
    const quantityInput = document.getElementById("mpCustomQuantity");
    const priceInput = document.getElementById("mpCustomPrice");
    const productName = document.getElementById("mpCustomProductName");

    /* =========================================================
       SIZE BUTTON + CUSTOM BUTTON
    ========================================================= */

    document.addEventListener("click", function (event) {

        const sizeButton = event.target.closest(".mp-size-option");

        if (!sizeButton) {
            return;
        }

        const product = sizeButton.closest(".mp-product");

        if (!product) {
            return;
        }

        /* Custom button */
        if (sizeButton.classList.contains("mp-custom-option")) {

            currentProduct = product;

            /*
             * Get 1 KG price from the same product
             */
            const oneKgButton = product.querySelector(
                '.mp-size-option[data-quantity="1 kg"]'
            );

            if (!oneKgButton) {
                return;
            }

            currentBasePrice = parseFloat(
                oneKgButton.dataset.price
            );

            /*
             * Product name
             */
            productName.textContent =
                product.dataset.product ||
                product.querySelector(".mp-product-name").textContent.trim();

            /*
             * Reset inputs
             */
            quantityInput.value = "";
            priceInput.value = "";

            /*
             * Open modal
             */
            modal.classList.add("active");
            document.body.style.overflow = "hidden";

            setTimeout(function () {
                quantityInput.focus();
            }, 100);

            return;
        }

        /* Normal size button */

        product.querySelectorAll(".mp-size-option").forEach(function (option) {
            option.classList.remove("active");
        });

        sizeButton.classList.add("active");

        const price = parseFloat(sizeButton.dataset.price);

        const priceElement = product.querySelector(
            ".mp-current-price"
        );

        if (priceElement && !isNaN(price)) {
            priceElement.textContent = "₹" + price;
        }
    });


    /* =========================================================
       CUSTOM QUANTITY → AUTOMATIC PRICE
       
       Formula:
       Price = Quantity in grams × (1 KG Price / 1000)
    ========================================================= */

    quantityInput.addEventListener("input", function () {

        if (!currentBasePrice) {
            priceInput.value = "";
            return;
        }

        /*
         * HTML input is text, so extract number from:
         * 750
         * 750 g
         * 750g
         */
        const quantityText = this.value.trim();

        const quantity = parseFloat(
            quantityText.replace(/[^\d.]/g, "")
        );

        if (
            isNaN(quantity) ||
            quantity <= 0
        ) {
            priceInput.value = "";
            return;
        }

        /*
         * Calculate price according to 1 KG price
         */
        const calculatedPrice =
            quantity * (currentBasePrice / 1000);

        priceInput.value = calculatedPrice.toFixed(2);
    });


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    function closeCustomModal() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

        currentProduct = null;
        currentBasePrice = 0;
    }


    document.getElementById("mpCustomClose")
        .addEventListener("click", closeCustomModal);


    document.getElementById("mpCustomCancel")
        .addEventListener("click", closeCustomModal);


    /* =========================================================
       ADD CUSTOM QUANTITY
    ========================================================= */

    document.getElementById("mpCustomAdd")
        .addEventListener("click", function () {

            if (!currentProduct) {
                return;
            }

            const quantityText = quantityInput.value.trim();

            const quantity = parseFloat(
                quantityText.replace(/[^\d.]/g, "")
            );

            const price = parseFloat(priceInput.value);

            if (
                isNaN(quantity) ||
                quantity <= 0
            ) {
                alert("Please enter a valid quantity.");
                quantityInput.focus();
                return;
            }

            if (
                isNaN(price) ||
                price <= 0
            ) {
                alert("Invalid price.");
                return;
            }


            /* -----------------------------------------
               Custom button
            ----------------------------------------- */

            const customButton = currentProduct.querySelector(
                ".mp-custom-option"
            );

            customButton.textContent =
                quantity + " g";

            customButton.dataset.quantity =
                quantity + " g";

            customButton.dataset.price =
                price;

            customButton.classList.add("active");


            /* -----------------------------------------
               Remove active from other sizes
            ----------------------------------------- */

            currentProduct
                .querySelectorAll(".mp-size-option")
                .forEach(function (option) {

                    if (option !== customButton) {
                        option.classList.remove("active");
                    }

                });


            /* -----------------------------------------
               Update product price
            ----------------------------------------- */

            const productPrice =
                currentProduct.querySelector(
                    ".mp-current-price"
                );

            if (productPrice) {

                productPrice.textContent =
                    "₹" + price.toFixed(2);

            }


            closeCustomModal();

        });


    /* =========================================================
       CLOSE WHEN CLICKING OUTSIDE MODAL
    ========================================================= */

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeCustomModal();
        }

    });


    /* =========================================================
       ESC KEY
    ========================================================= */

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeCustomModal();
        }

    });

});
