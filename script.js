/* =========================================================
   CATEGORY STICKY
========================================================= */

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

            if (
                !categorySection.classList.contains(
                    "is-sticky"
                )
            ) {

                const sectionHeight =
                    categorySection.offsetHeight;

                placeholder.style.height =
                    sectionHeight + "px";

                placeholder.classList.add(
                    "active"
                );

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

    calculateCategoryPosition();

    window.addEventListener(
        "scroll",
        handleCategorySticky,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        function () {

            calculateCategoryPosition();

            handleCategorySticky();
        }
    );

    handleCategorySticky();

});


/* =========================================================
   CUSTOM PRODUCT QUANTITY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    let currentProduct = null;
    let currentBasePrice = 0;

    const modal =
        document.getElementById("mpCustomModal");

    const quantityInput =
        document.getElementById("mpCustomQuantity");

    const priceInput =
        document.getElementById("mpCustomPrice");

    const productName =
        document.getElementById("mpCustomProductName");

    const closeButton =
        document.getElementById("mpCustomClose");

    const cancelButton =
        document.getElementById("mpCustomCancel");

    const addButton =
        document.getElementById("mpCustomAdd");


    if (
        !modal ||
        !quantityInput ||
        !priceInput
    ) {
        return;
    }


    /* =====================================================
       OPEN CUSTOM MODAL
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const sizeButton =
                event.target.closest(
                    ".mp-size-option"
                );

            if (!sizeButton) {
                return;
            }

            const product =
                sizeButton.closest(
                    ".mp-product"
                );

            if (!product) {
                return;
            }


            /* ---------------------------------------------
               CUSTOM OPTION
            --------------------------------------------- */

            if (
                sizeButton.classList.contains(
                    "mp-custom-option"
                )
            ) {

                currentProduct =
                    product;


                /* Get 1 KG price */

                const oneKgButton =
                    product.querySelector(
                        '.mp-size-option[data-quantity="1 kg"]'
                    );

                if (!oneKgButton) {
                    return;
                }


                currentBasePrice =
                    parseFloat(
                        oneKgButton.dataset.price
                    );


                if (
                    isNaN(currentBasePrice)
                ) {
                    currentBasePrice = 0;
                }


                /* Product name */

                if (productName) {

                    const name =
                        product.dataset.product ||
                        (
                            product.querySelector(
                                ".mp-product-name"
                            ) || {}
                        ).textContent ||
                        "Product";

                    productName.textContent =
                        name.trim();
                }


                /* Reset fields */

                quantityInput.value = "";
                priceInput.value = "";


                /* Open modal */

                modal.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";


                setTimeout(
                    function () {

                        quantityInput.focus();

                    },
                    100
                );

                return;
            }


            /* ---------------------------------------------
               NORMAL SIZE OPTION
            --------------------------------------------- */

            product
                .querySelectorAll(
                    ".mp-size-option"
                )
                .forEach(
                    function (option) {

                        option.classList.remove(
                            "active"
                        );

                    }
                );


            sizeButton.classList.add(
                "active"
            );


            const price =
                parseFloat(
                    sizeButton.dataset.price
                );


            const currentPrice =
                product.querySelector(
                    ".mp-current-price"
                );


            if (
                currentPrice &&
                !isNaN(price)
            ) {

                currentPrice.textContent =
                    "₹" + price;
            }

        }
    );


    /* =====================================================
       AUTOMATIC CUSTOM PRICE
       
       Formula:
       quantity in grams × 1 KG price / 1000
    ===================================================== */

    quantityInput.addEventListener(
        "input",
        function () {

            if (!currentBasePrice) {

                priceInput.value = "";

                return;
            }


            const quantityText =
                quantityInput.value.trim();


            const quantity =
                parseFloat(
                    quantityText.replace(
                        /[^\d.]/g,
                        ""
                    )
                );


            if (
                isNaN(quantity) ||
                quantity <= 0
            ) {

                priceInput.value = "";

                return;
            }


            const calculatedPrice =
                quantity *
                (
                    currentBasePrice /
                    1000
                );


            priceInput.value =
                calculatedPrice.toFixed(2);

        }
    );


    /* =====================================================
       CLOSE CUSTOM MODAL
    ===================================================== */

    function closeCustomModal() {

        modal.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

        currentProduct = null;

        currentBasePrice = 0;
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCustomModal
        );
    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeCustomModal
        );
    }


    /* =====================================================
       ADD CUSTOM QUANTITY
    ===================================================== */

    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                if (!currentProduct) {
                    return;
                }


                const quantityText =
                    quantityInput.value.trim();


                const quantity =
                    parseFloat(
                        quantityText.replace(
                            /[^\d.]/g,
                            ""
                        )
                    );


                const price =
                    parseFloat(
                        priceInput.value
                    );


                if (
                    isNaN(quantity) ||
                    quantity <= 0
                ) {

                    alert(
                        "Please enter a valid quantity."
                    );

                    quantityInput.focus();

                    return;
                }


                if (
                    isNaN(price) ||
                    price <= 0
                ) {

                    alert(
                        "Invalid price."
                    );

                    return;
                }


                /* -----------------------------------------
                   CUSTOM BUTTON
                ----------------------------------------- */

                const customButton =
                    currentProduct.querySelector(
                        ".mp-custom-option"
                    );


                if (customButton) {

                    customButton.textContent =
                        quantity + " g";

                    customButton.dataset.quantity =
                        quantity + " g";

                    customButton.dataset.price =
                        price;

                    customButton.classList.add(
                        "active"
                    );
                }


                /* -----------------------------------------
                   REMOVE OTHER ACTIVE OPTIONS
                ----------------------------------------- */

                currentProduct
                    .querySelectorAll(
                        ".mp-size-option"
                    )
                    .forEach(
                        function (option) {

                            if (
                                option !==
                                customButton
                            ) {

                                option.classList.remove(
                                    "active"
                                );
                            }

                        }
                    );


                /* -----------------------------------------
                   UPDATE PRODUCT PRICE
                ----------------------------------------- */

                const productPrice =
                    currentProduct.querySelector(
                        ".mp-current-price"
                    );


                if (productPrice) {

                    productPrice.textContent =
                        "₹" +
                        price.toFixed(2);
                }


                closeCustomModal();

            }
        );
    }


    /* =====================================================
       CLOSE ON OVERLAY CLICK
    ===================================================== */

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeCustomModal();
            }

        }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closeCustomModal();
            }

        }
    );

});


/* =========================================================
   SPECIAL OFFERS + ADMIN PANEL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const STORAGE_KEY =
            "mpSpecialOffersSettings";


        /* =================================================
           DEFAULT SETTINGS
        ================================================= */

        const defaultSettings = {

            enabled: false,

            offers: [

                {
                    image:
                        "https://placehold.co/600x900/png?text=Special+Offer+1",

                    title:
                        "Fresh Grocery Offer",

                    sub:
                        "Save more on daily essentials",

                    link:
                        "#"
                },

                {
                    image:
                        "https://placehold.co/600x900/png?text=Special+Offer+2",

                    title:
                        "Weekend Savings",

                    sub:
                        "Special prices for you",

                    link:
                        "#"
                },

                {
                    image:
                        "https://placehold.co/600x900/png?text=Special+Offer+3",

                    title:
                        "Local Store Deals",

                    sub:
                        "Shop fresh. Save more.",

                    link:
                        "#"
                }

            ]
        };


        /* =================================================
           HELPER
        ================================================= */

        const $ =
            function (selector) {

                return document.querySelector(
                    selector
                );

            };


        /* =================================================
           GET SETTINGS
        ================================================= */

        function getSettings() {

            try {

                const saved =
                    localStorage.getItem(
                        STORAGE_KEY
                    );


                if (!saved) {

                    return JSON.parse(
                        JSON.stringify(
                            defaultSettings
                        )
                    );
                }


                const parsed =
                    JSON.parse(
                        saved
                    );


                return {

                    enabled:
                        Boolean(
                            parsed.enabled
                        ),

                    offers:
                        defaultSettings.offers.map(
                            function (
                                defaultOffer,
                                index
                            ) {

                                return Object.assign(
                                    {},
                                    defaultOffer,
                                    parsed.offers &&
                                    parsed.offers[index]
                                        ? parsed.offers[index]
                                        : {}
                                );

                            }
                        )

                };

            } catch (error) {

                return JSON.parse(
                    JSON.stringify(
                        defaultSettings
                    )
                );

            }

        }


        /* =================================================
           SAVE SETTINGS
        ================================================= */

        function saveSettings(
            settings
        ) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    settings
                )
            );

        }


        /* =================================================
           APPLY OFFERS TO HOME PAGE
        ================================================= */

        function applySpecialOffers() {

            const settings =
                getSettings();


            const section =
                $(
                    "#mpSpecialOffers"
                );


            if (!section) {
                return;
            }


            /*
             * When unchecked:
             * hide complete section.
             */

            section.hidden =
                !settings.enabled;


            settings.offers.forEach(
                function (
                    offer,
                    index
                ) {

                    const number =
                        index + 1;


                    const image =
                        $(
                            "#mpSpecialOfferImage" +
                            number
                        );


                    const title =
                        $(
                            "#mpSpecialOfferTitle" +
                            number
                        );


                    const sub =
                        $(
                            "#mpSpecialOfferSub" +
                            number
                        );


                    const link =
                        $(
                            "#mpSpecialOffer" +
                            number
                        );


                    if (image) {

                        image.src =
                            offer.image ||
                            defaultSettings
                                .offers[index]
                                .image;


                        image.alt =
                            offer.title ||
                            "Special Offer";
                    }


                    if (title) {

                        title.textContent =
                            offer.title ||
                            "";
                    }


                    if (sub) {

                        sub.textContent =
                            offer.sub ||
                            "";
                    }


                    if (link) {

                        link.href =
                            offer.link ||
                            "#";
                    }

                }
            );

        }


        /* =================================================
           ADMIN ELEMENTS
        ================================================= */

        const storeLogo =
            $(
                "#mpStoreLogo"
            );


        const adminPage =
            $(
                "#mpAdminPage"
            );


        const adminLogin =
            $(
                "#mpAdminLogin"
            );


        const adminDashboard =
            $(
                "#mpAdminDashboard"
            );


        const adminBack =
            $(
                "#mpAdminBack"
            );


        const loginForm =
            $(
                "#mpAdminLoginForm"
            );


        const loginError =
            $(
                "#mpAdminLoginError"
            );


        const logoutButton =
            $(
                "#mpAdminLogout"
            );


        const saveButton =
            $(
                "#mpAdminSave"
            );


        const cancelButton =
            $(
                "#mpAdminCancel"
            );


        const enabledCheckbox =
            $(
                "#mpSpecialOfferEnabled"
            );


        const status =
            $(
                "#mpSpecialOfferStatus"
            );


        /* =================================================
           OPEN ADMIN LOGIN
        ================================================= */

        function openAdminLogin() {

            if (!adminPage) {
                return;
            }


            adminPage.hidden =
                false;


            if (adminLogin) {

                adminLogin.hidden =
                    false;
            }


            if (adminDashboard) {

                adminDashboard.hidden =
                    true;
            }


            if (loginError) {

                loginError.textContent =
                    "";
            }


            document.body.style.overflow =
                "hidden";


            const username =
                $(
                    "#mpAdminUsername"
                );


            if (username) {

                setTimeout(
                    function () {

                        username.focus();

                    },
                    100
                );
            }

        }


        /* =================================================
           CLOSE ADMIN
        ================================================= */

        function closeAdmin() {

            if (!adminPage) {
                return;
            }


            adminPage.hidden =
                true;


            document.body.style.overflow =
                "";


            /*
             * Remove #admin from URL
             */

            if (
                window.location.hash ===
                "#admin"
            ) {

                history.replaceState(
                    null,
                    "",
                    window.location.pathname +
                    window.location.search
                );
            }

        }


        /* =================================================
           OPEN DASHBOARD
        ================================================= */

        function openDashboard() {

            if (adminLogin) {

                adminLogin.hidden =
                    true;
            }


            if (adminDashboard) {

                adminDashboard.hidden =
                    false;
            }


            loadAdminForm();

        }


        /* =================================================
           LOGO CLICK
        ================================================= */

        if (storeLogo) {

            storeLogo.addEventListener(
                "click",
                openAdminLogin
            );

        }


        /* =================================================
           BACK BUTTON
        ================================================= */

        if (adminBack) {

            adminBack.addEventListener(
                "click",
                closeAdmin
            );

        }


        /* =================================================
           ADMIN LOGIN
           
           DEMO:
           Username: admin
           Password: admin123
           
           IMPORTANT:
           This is only front-end demo authentication.
           Real website authentication must be server-side.
        ================================================= */

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const usernameInput =
                        $(
                            "#mpAdminUsername"
                        );


                    const passwordInput =
                        $(
                            "#mpAdminPassword"
                        );


                    const username =
                        usernameInput
                            ? usernameInput.value.trim()
                            : "";


                    const password =
                        passwordInput
                            ? passwordInput.value
                            : "";


                    if (
                        username ===
                            "admin" &&
                        password ===
                            "admin123"
                    ) {

                        sessionStorage.setItem(
                            "mpAdminLoggedIn",
                            "true"
                        );


                        if (loginError) {

                            loginError.textContent =
                                "";
                        }


                        openDashboard();

                    } else {

                        if (loginError) {

                            loginError.textContent =
                                "Invalid username or password.";
                        }

                    }

                }
            );

        }


        /* =================================================
           LOGOUT
        ================================================= */

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    sessionStorage.removeItem(
                        "mpAdminLoggedIn"
                    );


                    if (adminLogin) {

                        adminLogin.hidden =
                            false;
                    }


                    if (adminDashboard) {

                        adminDashboard.hidden =
                            true;
                    }


                    const passwordInput =
                        $(
                            "#mpAdminPassword"
                        );


                    if (passwordInput) {

                        passwordInput.value =
                            "";
                    }


                    const usernameInput =
                        $(
                            "#mpAdminUsername"
                        );


                    if (usernameInput) {

                        usernameInput.focus();
                    }

                }
            );

        }


        /* =================================================
           LOAD ADMIN FORM
        ================================================= */

        function loadAdminForm() {

            const settings =
                getSettings();


            if (enabledCheckbox) {

                enabledCheckbox.checked =
                    settings.enabled;
            }


            settings.offers.forEach(
                function (
                    offer,
                    index
                ) {

                    const number =
                        index + 1;


                    const imageInput =
                        $(
                            "#mpAdminImage" +
                            number
                        );


                    const titleInput =
                        $(
                            "#mpAdminTitle" +
                            number
                        );


                    const subInput =
                        $(
                            "#mpAdminSub" +
                            number
                        );


                    const linkInput =
                        $(
                            "#mpAdminLink" +
                            number
                        );


                    const preview =
                        $(
                            "#mpAdminPreview" +
                            number
                        );


                    if (imageInput) {

                        imageInput.value =
                            offer.image ||
                            "";
                    }


                    if (titleInput) {

                        titleInput.value =
                            offer.title ||
                            "";
                    }


                    if (subInput) {

                        subInput.value =
                            offer.sub ||
                            "";
                    }


                    if (linkInput) {

                        linkInput.value =
                            offer.link ||
                            "#";
                    }


                    if (preview) {

                        preview.src =
                            offer.image ||
                            defaultSettings
                                .offers[index]
                                .image;
                    }

                }
            );


            updateAdminStatus(
                settings.enabled
            );

        }


        /* =================================================
           ADMIN STATUS
        ================================================= */

        function updateAdminStatus(
            enabled
        ) {

            if (!status) {
                return;
            }


            status.classList.toggle(
                "is-enabled",
                enabled
            );


            status.textContent =
                enabled
                    ? "Special offers are enabled and will appear below the search area."
                    : "Special offers are disabled. The home page will remain normal.";

        }


        /* =================================================
           ENABLE / DISABLE CHECKBOX
        ================================================= */

        if (enabledCheckbox) {

            enabledCheckbox.addEventListener(
                "change",
                function () {

                    updateAdminStatus(
                        enabledCheckbox.checked
                    );

                }
            );

        }


        /* =================================================
           LIVE IMAGE PREVIEW
        ================================================= */

        [1, 2, 3].forEach(
            function (number) {

                const imageInput =
                    $(
                        "#mpAdminImage" +
                        number
                    );


                const preview =
                    $(
                        "#mpAdminPreview" +
                        number
                    );


                if (
                    !imageInput ||
                    !preview
                ) {
                    return;
                }


                imageInput.addEventListener(
                    "input",
                    function () {

                        const value =
                            imageInput.value.trim();


                        if (value) {

                            preview.src =
                                value;

                        } else {

                            preview.src =
                                defaultSettings
                                    .offers[
                                        number - 1
                                    ]
                                    .image;
                        }

                    }
                );


                preview.addEventListener(
                    "error",
                    function () {

                        preview.src =
                            defaultSettings
                                .offers[
                                    number - 1
                                ]
                                .image;

                    }
                );

            }
        );


        /* =================================================
           SAVE SPECIAL OFFERS
        ================================================= */

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function () {

                    const settings = {

                        enabled:
                            enabledCheckbox
                                ? Boolean(
                                    enabledCheckbox.checked
                                )
                                : false,

                        offers: []

                    };


                    [1, 2, 3].forEach(
                        function (number) {

                            const defaultOffer =
                                defaultSettings
                                    .offers[
                                        number - 1
                                    ];


                            const imageInput =
                                $(
                                    "#mpAdminImage" +
                                    number
                                );


                            const titleInput =
                                $(
                                    "#mpAdminTitle" +
                                    number
                                );


                            const subInput =
                                $(
                                    "#mpAdminSub" +
                                    number
                                );


                            const linkInput =
                                $(
                                    "#mpAdminLink" +
                                    number
                                );


                            settings.offers.push({

                                image:
                                    imageInput
                                        ? imageInput.value.trim() ||
                                          defaultOffer.image
                                        : defaultOffer.image,


                                title:
                                    titleInput
                                        ? titleInput.value.trim() ||
                                          defaultOffer.title
                                        : defaultOffer.title,


                                sub:
                                    subInput
                                        ? subInput.value.trim() ||
                                          defaultOffer.sub
                                        : defaultOffer.sub,


                                link:
                                    linkInput
                                        ? linkInput.value.trim() ||
                                          "#"
                                        : "#"

                            });

                        }
                    );


                    /* Save */

                    saveSettings(
                        settings
                    );


                    /* Apply immediately */

                    applySpecialOffers();


                    updateAdminStatus(
                        settings.enabled
                    );


                    /* Save button feedback */

                    saveButton.innerHTML =
                        '<i class="fa-solid fa-check"></i> Saved';


                    setTimeout(
                        function () {

                            saveButton.innerHTML =
                                '<i class="fa-solid fa-floppy-disk"></i> Save Special Offers';

                        },
                        1400
                    );

                }
            );

        }


        /* =================================================
           RESET / CANCEL FORM
        ================================================= */

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                function () {

                    loadAdminForm();

                }
            );

        }


        /* =================================================
           #admin URL
           
           Example:
           yourwebsite.com/#admin
        ================================================= */

        function checkAdminHash() {

            if (
                window.location.hash ===
                "#admin"
            ) {

                openAdminLogin();

            }

        }


        window.addEventListener(
            "hashchange",
            checkAdminHash
        );


        /* =================================================
           INITIALIZE SPECIAL OFFERS
        ================================================= */

        applySpecialOffers();


        checkAdminHash();

    }
);
