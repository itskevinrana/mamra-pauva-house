/* =========================================================
   CUSTOM QUANTITY MODAL
========================================================= */

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

    if (!customModal || !customClose || !customCancel || !customAdd || !customProductName || !customQuantity || !customPrice) {
        return;
    }


    let currentCustomButton = null;


    /* =========================================================
       OPEN CUSTOM MODAL
    ========================================================= */

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


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

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


    /* =========================================================
       ADD CUSTOM OPTION
    ========================================================= */

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


    /* =========================================================
       CLOSE ON OVERLAY CLICK
    ========================================================= */

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


    /* =========================================================
       CLOSE WITH ESC
    ========================================================= */

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


/* =========================================================
   NORMAL PRODUCT SIZE SELECTION
========================================================= */

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


        /* Remove active */

        product
            .querySelectorAll(".mp-size-option")
            .forEach(function (option) {

                option.classList.remove("active");

            });


        /* Set active */

        sizeButton.classList.add("active");


        /* Get price */

        const price =
            sizeButton.dataset.price;


        /* Update current price */

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


/* =========================================================
   CUSTOM QUANTITY + AUTOMATIC PRICE
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

    if (!modal || !quantityInput || !priceInput || !productName) {
        return;
    }


    /* =========================================================
       SIZE BUTTON + CUSTOM BUTTON
    ========================================================= */

    document.addEventListener("click", function (event) {

        const sizeButton =
            event.target.closest(".mp-size-option");

        if (!sizeButton) {
            return;
        }

        const product =
            sizeButton.closest(".mp-product");

        if (!product) {
            return;
        }


        /* =====================================================
           CUSTOM BUTTON
        ===================================================== */

        if (
            sizeButton.classList.contains(
                "mp-custom-option"
            )
        ) {

            currentProduct = product;


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


            /* Product name */

            productName.textContent =
                product.dataset.product ||
                product
                    .querySelector(".mp-product-name")
                    .textContent
                    .trim();


            /* Reset inputs */

            quantityInput.value = "";
            priceInput.value = "";


            /* Open modal */

            modal.classList.add("active");

            document.body.style.overflow =
                "hidden";


            setTimeout(function () {

                quantityInput.focus();

            }, 100);


            return;
        }


        /* =====================================================
           NORMAL SIZE BUTTON
        ===================================================== */

        product
            .querySelectorAll(".mp-size-option")
            .forEach(function (option) {

                option.classList.remove("active");

            });


        sizeButton.classList.add("active");


        const price =
            parseFloat(
                sizeButton.dataset.price
            );


        const priceElement =
            product.querySelector(
                ".mp-current-price"
            );


        if (
            priceElement &&
            !isNaN(price)
        ) {

            priceElement.textContent =
                "₹" + price;

        }

    });


    /* =========================================================
       CUSTOM QUANTITY → AUTOMATIC PRICE
       
       Formula:

       Price =
       Quantity in grams × (1 KG Price / 1000)
    ========================================================= */

    quantityInput.addEventListener(
        "input",
        function () {

            if (!currentBasePrice) {

                priceInput.value = "";

                return;
            }


            const quantityText =
                this.value.trim();


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


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    function closeCustomModal() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

        currentProduct = null;

        currentBasePrice = 0;
    }


    document
        .getElementById("mpCustomClose")
        .addEventListener(
            "click",
            closeCustomModal
        );


    document
        .getElementById("mpCustomCancel")
        .addEventListener(
            "click",
            closeCustomModal
        );


    /* =========================================================
       ADD CUSTOM QUANTITY
    ========================================================= */

    document
        .getElementById("mpCustomAdd")
        .addEventListener(
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

                    alert("Invalid price.");

                    return;
                }


                /* =================================================
                   CUSTOM BUTTON
                ================================================= */

                const customButton =
                    currentProduct.querySelector(
                        ".mp-custom-option"
                    );


                customButton.textContent =
                    quantity + " g";


                customButton.dataset.quantity =
                    quantity + " g";


                customButton.dataset.price =
                    price;


                customButton.classList.add(
                    "active"
                );


                /* =================================================
                   REMOVE ACTIVE FROM OTHER SIZES
                ================================================= */

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


                /* =================================================
                   UPDATE PRODUCT PRICE
                ================================================= */

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


    /* =========================================================
       CLOSE WHEN CLICKING OUTSIDE MODAL
    ========================================================= */

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


    /* =========================================================
       ESC KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeCustomModal();

            }

        }
    );

});


/* =========================================================
   SPECIAL OFFERS + ADMIN PANEL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY =
        "mpSpecialOffersSettings";


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


    const $ = function (selector) {

        return document.querySelector(
            selector
        );

    };


    /* =========================================================
       GET SETTINGS
    ========================================================= */

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
                JSON.parse(saved);


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

        }

        catch (error) {

            return JSON.parse(
                JSON.stringify(
                    defaultSettings
                )
            );

        }

    }


    /* =========================================================
       SAVE SETTINGS
    ========================================================= */

    function saveSettings(settings) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

    }


    /* =========================================================
       APPLY SPECIAL OFFERS TO HOME PAGE
    ========================================================= */

    function applySpecialOffers() {

        const settings =
            getSettings();


        const section =
            $("#mpSpecialOffers");


        if (!section) {
            return;
        }


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


    /* =========================================================
       ADMIN ELEMENTS
    ========================================================= */

    const storeLogo =
        $("#mpStoreLogo");


    const adminPage =
        $("#mpAdminPage");


    const adminLogin =
        $("#mpAdminLogin");


    const adminDashboard =
        $("#mpAdminDashboard");


    const adminBack =
        $("#mpAdminBack");


    const loginForm =
        $("#mpAdminLoginForm");


    const loginError =
        $("#mpAdminLoginError");


    const logoutButton =
        $("#mpAdminLogout");


    const saveButton =
        $("#mpAdminSave");


    const cancelButton =
        $("#mpAdminCancel");


    const enabledCheckbox =
        $("#mpSpecialOfferEnabled");


    const status =
        $("#mpSpecialOfferStatus");


    /* =========================================================
       OPEN ADMIN LOGIN
    ========================================================= */

    function openAdminLogin() {

        if (!adminPage) {
            return;
        }


        adminPage.hidden =
            false;


        adminLogin.hidden =
            false;


        adminDashboard.hidden =
            true;


        loginError.textContent =
            "";


        document.body.style.overflow =
            "hidden";


        const username =
            $("#mpAdminUsername");


        if (username) {

            setTimeout(
                function () {

                    username.focus();

                },
                100
            );

        }

    }


    /* =========================================================
       CLOSE ADMIN
    ========================================================= */

    function closeAdmin() {

        if (!adminPage) {
            return;
        }


        adminPage.hidden =
            true;


        document.body.style.overflow =
            "";


        window.location.hash =
            "";

    }


    /* =========================================================
       OPEN ADMIN DASHBOARD
    ========================================================= */

    function openDashboard() {

        adminLogin.hidden =
            true;


        adminDashboard.hidden =
            false;


        loadAdminForm();

    }


    /* =========================================================
       ADMIN LOGIN

       Demo:

       Username: admin
       Password: admin123
    ========================================================= */

    if (storeLogo) {

        storeLogo.addEventListener(
            "click",
            openAdminLogin
        );

    }


    if (adminBack) {

        adminBack.addEventListener(
            "click",
            closeAdmin
        );

    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    $("#mpAdminUsername")
                        .value
                        .trim();


                const password =
                    $("#mpAdminPassword")
                        .value;


                if (
                    username === "admin" &&
                    password === "admin123"
                ) {

                    sessionStorage.setItem(
                        "mpAdminLoggedIn",
                        "true"
                    );


                    loginError.textContent =
                        "";


                    openDashboard();

                }

                else {

                    loginError.textContent =
                        "Invalid username or password.";

                }

            }
        );

    }


    /* =========================================================
       ADMIN LOGOUT
    ========================================================= */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                sessionStorage.removeItem(
                    "mpAdminLoggedIn"
                );


                adminLogin.hidden =
                    false;


                adminDashboard.hidden =
                    true;


                $("#mpAdminPassword")
                    .value = "";


                if (
                    $("#mpAdminUsername")
                ) {

                    $("#mpAdminUsername")
                        .focus();

                }

            }
        );

    }


    /* =========================================================
       LOAD ADMIN FORM
    ========================================================= */

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


    /* =========================================================
       UPDATE ADMIN STATUS
    ========================================================= */

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


    /* =========================================================
       LIVE IMAGE PREVIEW
    ========================================================= */

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
                        imageInput.value
                            .trim();


                    if (value) {

                        preview.src =
                            value;

                    }

                }
            );


            preview.addEventListener(
                "error",
                function () {

                    preview.src =
                        defaultSettings
                            .offers[number - 1]
                            .image;

                }
            );

        }
    );


    /* =========================================================
       SAVE SPECIAL OFFERS
    ========================================================= */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const settings = {

                    enabled:
                        Boolean(
                            enabledCheckbox.checked
                        ),

                    offers: []

                };


                [1, 2, 3].forEach(
                    function (number) {

                        const defaultOffer =
                            defaultSettings
                                .offers[number - 1];


                        settings.offers.push({

                            image:
                                $(
                                    "#mpAdminImage" +
                                    number
                                )
                                .value
                                .trim() ||
                                defaultOffer.image,


                            title:
                                $(
                                    "#mpAdminTitle" +
                                    number
                                )
                                .value
                                .trim() ||
                                defaultOffer.title,


                            sub:
                                $(
                                    "#mpAdminSub" +
                                    number
                                )
                                .value
                                .trim() ||
                                defaultOffer.sub,


                            link:
                                $(
                                    "#mpAdminLink" +
                                    number
                                )
                                .value
                                .trim() ||
                                "#"

                        });

                    }
                );


                saveSettings(
                    settings
                );


                applySpecialOffers();


                updateAdminStatus(
                    settings.enabled
                );


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


    /* =========================================================
       RESET / CANCEL FORM
    ========================================================= */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                loadAdminForm();

            }
        );

    }


    /* =========================================================
       LOGO → ADMIN LOGIN PAGE
       
       URL:
       #admin
    ========================================================= */

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


    /* =========================================================
       INITIALIZE
    ========================================================= */

    applySpecialOffers();

    checkAdminHash();

});

/* =========================================================
   STICKY SEARCH ABOVE BOTTOM NAV
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const header =
        document.querySelector(".mp-header");

    const originalSearch =
        document.querySelector(".mp-search-wrapper");

    const stickySearch =
        document.getElementById("mpStickySearch");

    const stickyInput =
        document.getElementById("mpStickySearchInput");

    const stickyClear =
        document.getElementById("mpStickySearchClear");

    const bottomNav =
        document.querySelector(".mp-bottom-nav");


    if (
        !header ||
        !originalSearch ||
        !stickySearch ||
        !bottomNav
    ) {
        return;
    }


    /* =====================================================
       SET STICKY SEARCH POSITION
    ===================================================== */

    function updateStickySearchPosition() {

        const bottomNavHeight =
            bottomNav.offsetHeight;

        stickySearch.style.bottom =
            bottomNavHeight + "px";
    }


    /* =====================================================
       CHECK SCROLL POSITION
    ===================================================== */

    function checkStickySearch() {

        /* Only mobile/tablet */

        if (window.innerWidth > 1024) {

            stickySearch.classList.remove(
                "is-visible"
            );

            return;
        }


        /*
         * Get the bottom position of header
         */

        const headerRect =
            header.getBoundingClientRect();


        /*
         * Header has completely passed
         * above the viewport
         */

        if (headerRect.bottom <= 0) {

            stickySearch.classList.add(
                "is-visible"
            );

        }

        else {

            stickySearch.classList.remove(
                "is-visible"
            );

        }

    }


    /* =====================================================
       SYNC SEARCH VALUE
    ===================================================== */

    if (stickyInput) {

        stickyInput.addEventListener(
            "input",
            function () {

                /*
                 * Find original search input
                 */

                const originalInput =
                    originalSearch.querySelector(
                        "input"
                    );


                if (originalInput) {

                    originalInput.value =
                        stickyInput.value;


                    /*
                     * Trigger input event so
                     * existing search functionality
                     * continues working.
                     */

                    originalInput.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }

            }
        );

    }


    /* =====================================================
       CLICK STICKY SEARCH
    ===================================================== */

    if (stickyInput) {

        stickyInput.addEventListener(
            "focus",
            function () {

                const originalInput =
                    originalSearch.querySelector(
                        "input"
                    );


                if (originalInput) {

                    originalInput.value =
                        stickyInput.value;

                }

            }
        );

    }


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    if (stickyClear) {

        stickyClear.addEventListener(
            "click",
            function () {

                stickyInput.value = "";


                const originalInput =
                    originalSearch.querySelector(
                        "input"
                    );


                if (originalInput) {

                    originalInput.value = "";


                    originalInput.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                stickyInput.focus();

            }
        );

    }


    /* =====================================================
       SCROLL
    ===================================================== */

    window.addEventListener(
        "scroll",
        checkStickySearch,
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            updateStickySearchPosition();

            checkStickySearch();

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateStickySearchPosition();

    checkStickySearch();

});

document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".mp-delivery-slide");
    const dots = document.querySelectorAll(".mp-delivery-dot");

    if (!slides.length || !dots.length) {
        return;
    }

    let currentSlide = 0;
    let sliderTimer = null;


    function showDeliverySlide(index) {

        if (index < 0 || index >= slides.length) {
            return;
        }

        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });

        currentSlide = index;
    }


    function nextDeliverySlide() {

        let nextSlide = currentSlide + 1;

        if (nextSlide >= slides.length) {
            nextSlide = 0;
        }

        showDeliverySlide(nextSlide);
    }


    function startDeliverySlider() {

        clearInterval(sliderTimer);

        sliderTimer = setInterval(function () {
            nextDeliverySlide();
        }, 3000);
    }


    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            showDeliverySlide(index);

            startDeliverySlider();

        });

    });


    // Start first slide
    showDeliverySlide(0);

    // Start automatic slider
    startDeliverySlider();

});

/* =========================================================
   CATEGORY PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("categoryProducts");
    if (!productsContainer) return;

    const title = document.getElementById("categoryTitle");
    const description = document.getElementById("categoryDescription");
    const productsTitle = document.getElementById("categoryProductsTitle");
    const count = document.getElementById("categoryProductCount");
    const empty = document.getElementById("categoryEmpty");
    const search = document.getElementById("categorySearch");
    const sort = document.getElementById("categorySortButton");

    const data = {
        vegetables: {name:"Vegetables",description:"Fresh vegetables for your everyday cooking.",products:[["Potato","🥔",40,"OFFER"],["Onion","🧅",35,""],["Tomato","🍅",40,"FRESH"],["Carrot","🥕",55,""],["Capsicum","🫑",70,""],["Cauliflower","🥦",50,""],["Cucumber","🥒",35,""],["Green Peas","🫛",80,"NEW"]]},
        fruits: {name:"Fruits",description:"Fresh and seasonal fruits for your family.",products:[["Apple","🍎",160,"FRESH"],["Banana","🍌",60,""],["Orange","🍊",90,""],["Mango","🥭",120,"SEASONAL"],["Grapes","🍇",100,""],["Pomegranate","🍎",150,""],["Guava","🍐",70,""],["Papaya","🍈",65,""]]},
        dairy: {name:"Dairy",description:"Daily dairy essentials from trusted brands.",products:[["Amul Milk","🥛",60,"POPULAR"],["Curd","🥣",45,""],["Butter","🧈",60,""],["Paneer","🧀",95,"FRESH"],["Cheese","🧀",120,""],["Buttermilk","🥛",20,""],["Ghee","🫙",180,""],["Lassi","🥛",35,""]]},
        biscuits: {name:"Biscuits",description:"Tea-time biscuits and everyday favourites.",products:[["Parle-G Biscuits","🍪",100,"SALE"],["Good Day","🍪",120,""],["Marie Gold","🍪",120,""],["Hide & Seek","🍪",160,"POPULAR"],["Bourbon","🍪",140,""],["Monaco","🍪",100,""],["KrackJack","🍪",100,""],["Milk Bikis","🍪",120,""]]},
        beverages: {name:"Beverages",description:"Cold drinks, juices and refreshing beverages.",products:[["Cold Drink","🥤",60,""],["Fruit Juice","🧃",90,""],["Lemon Drink","🍋",45,""],["Soda","🥤",35,""],["Iced Tea","🧋",70,"NEW"],["Energy Drink","🥤",110,""],["Coconut Water","🥥",55,"FRESH"],["Mango Drink","🧃",60,""]]},
        snacks: {name:"Snacks",description:"Namkeen, chips and snacks for every mood.",products:[["Potato Chips","🍟",40,"POPULAR"],["Bhakharwadi","🥨",100,"BEST SELLER"],["Popcorn","🍿",100,""],["Namkeen Mix","🥨",80,""],["Sev","🥨",70,""],["Gathiya","🥨",75,""],["Chakri","🥨",90,""],["Masala Peanuts","🥜",80,""]]},
        poha: {name:"Poha",description:"Fresh poha and pauva for your daily needs.",products:[["Mamra Poha","🍚",100,"BEST SELLER"],["Thin Poha","🍚",90,""],["Indori Poha","🍚",110,"POPULAR"],["Nylon Poha","🍚",120,""],["Thick Poha","🍚",95,""],["Red Poha","🍚",115,"NEW"],["Premium Poha","🍚",130,""],["Poha Mix","🍚",140,""]]},
        rice: {name:"Rice",description:"Quality rice varieties for everyday meals.",products:[["Basmati Rice","🍚",160,"POPULAR"],["Kolam Rice","🍚",75,""],["Sona Masoori Rice","🍚",85,""],["Gujarat Rice","🍚",70,""],["Jeera Rice","🍚",110,""],["Brown Rice","🍚",140,"HEALTHY"],["Steam Rice","🍚",90,""],["Premium Basmati","🍚",220,""]]},
        dal: {name:"Dal",description:"Quality pulses and dals for your kitchen.",products:[["Toor Dal","🫘",140,"BEST SELLER"],["Moong Dal","🫘",130,""],["Masoor Dal","🫘",110,""],["Chana Dal","🫘",100,""],["Urad Dal","🫘",135,""],["Moong Chilka","🫘",125,""],["Kabuli Chana","🫘",120,"POPULAR"],["Rajma","🫘",140,""]]},
        flour: {name:"Flour",description:"Atta, flour and everyday kitchen staples.",products:[["Wheat Atta","🌾",55,"POPULAR"],["Maida","🌾",50,""],["Besan","🌾",85,""],["Ragi Flour","🌾",100,"HEALTHY"],["Jowar Flour","🌾",90,""],["Bajra Flour","🌾",80,""],["Rice Flour","🌾",70,""],["Multigrain Atta","🌾",120,"NEW"]]},
        "personal-care": {name:"Personal Care",description:"Everyday personal care and hygiene essentials.",products:[["Bath Soap","🧼",35,""],["Shampoo","🧴",120,"POPULAR"],["Toothpaste","🪥",90,""],["Toothbrush","🪥",45,""],["Face Wash","🧴",110,""],["Hand Wash","🧴",100,""],["Hair Oil","🧴",130,""],["Body Lotion","🧴",150,""]]},
        household: {name:"Household",description:"Cleaning and household essentials for your home.",products:[["Dishwash","🧽",70,""],["Floor Cleaner","🧴",120,"POPULAR"],["Detergent","🧺",110,""],["Toilet Cleaner","🧴",95,""],["Scrub Pad","🧽",30,""],["Garbage Bags","🛍️",60,""],["Tissue Paper","🧻",80,""],["Air Freshener","🌸",130,"NEW"]]}
    };

    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get("category") && data[params.get("category")] ? params.get("category") : "poha";
    let ascending = true;

    function render() {
        const category = data[currentCategory];
        const query = search.value.trim().toLowerCase();
        let products = category.products.filter(function (p) { return p[0].toLowerCase().includes(query); });
        products.sort(function (a,b) { return ascending ? a[2]-b[2] : b[2]-a[2]; });

        title.textContent = category.name;
        description.textContent = category.description;
        productsTitle.textContent = category.name;
        count.textContent = products.length + " products";
        empty.hidden = products.length > 0;

        productsContainer.innerHTML = products.map(function (p) {
            const name=p[0], icon=p[1], kg=Number(p[2]), badge=p[3];
            const p250=Math.round(kg*.25), p500=Math.round(kg*.5);
            return `
                <article class="mp-product" data-product="${name}">
                    <div class="mp-product-image">
                        ${badge ? `<span class="mp-product-badge">${badge}</span>` : ""}
                        <button type="button" class="mp-wishlist" aria-label="Add ${name} to wishlist">♡</button>
                        ${icon}
                    </div>
                    <div class="mp-product-info">
                        <div class="mp-product-name">${name}</div>
                        <div class="mp-product-options">
                            <button type="button" class="mp-size-option" data-quantity="250 g" data-price="${p250}">250 g</button>
                            <button type="button" class="mp-size-option active" data-quantity="500 g" data-price="${p500}">500 g</button>
                            <button type="button" class="mp-size-option" data-quantity="1 kg" data-price="${kg}">1 kg</button>
                            <button type="button" class="mp-size-option mp-custom-option" data-product="${name}">Custom</button>
                        </div>
                        <div class="mp-product-bottom">
                            <div class="mp-price"><span class="mp-current-price">₹${p500}</span></div>
                            <button type="button" class="mp-add">ADD</button>
                        </div>
                    </div>
                </article>`;
        }).join("");

        document.querySelectorAll("#categoryNav a").forEach(function (a) {
            a.classList.toggle("active", a.dataset.category === currentCategory);
        });
    }

    search.addEventListener("input", render);
    sort.addEventListener("click", function () {
        ascending = !ascending;
        sort.textContent = ascending ? "⇅ Sort: Low" : "⇅ Sort: High";
        render();
    });

    document.addEventListener("click", function (event) {
        const add = event.target.closest(".mp-category-products .mp-add");
        if (!add) return;
        add.textContent = "ADDED";
        setTimeout(function () { add.textContent = "ADD"; }, 900);
    });

    render();
});

document.addEventListener("DOMContentLoaded", function () {

    const navItems = document.querySelectorAll(".mp-bottom-nav .mp-nav-item");

    if (!navItems.length) return;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();

    navItems.forEach(function (item) {
        const href = item.getAttribute("href");

        if (!href || href === "#") return;

        const linkPage = href.split("/").pop().split("?")[0].toLowerCase();

        item.classList.remove("active");

        if (
            (currentPage === "category.html" && linkPage === "category.html") ||
            (currentPage === "index.html" && linkPage === "index.html")
        ) {
            item.classList.add("active");
        }
    });

});

/* =========================================================
   ACCOUNT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const accountForm = document.getElementById("mpAccountForm");

    if (!accountForm) {
        return;
    }


    const mobileInput = document.getElementById("accountMobile");
    const nameInput = document.getElementById("accountName");
    const addressInput = document.getElementById("accountAddress");


    /*
     * Load saved account details
     */

    const savedAccount = localStorage.getItem("mpAccountDetails");


    if (savedAccount) {

        try {

            const account = JSON.parse(savedAccount);

            if (account.mobile && mobileInput) {
                mobileInput.value = account.mobile;
            }

            if (account.name && nameInput) {
                nameInput.value = account.name;
            }

            if (account.address && addressInput) {
                addressInput.value = account.address;
            }

        } catch (error) {

            console.error(
                "Unable to load account details:",
                error
            );

        }

    }


    /*
     * Save account details
     */

    accountForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const accountDetails = {

            mobile: mobileInput
                ? mobileInput.value.trim()
                : "",

            name: nameInput
                ? nameInput.value.trim()
                : "",

            address: addressInput
                ? addressInput.value.trim()
                : ""

        };


        localStorage.setItem(
            "mpAccountDetails",
            JSON.stringify(accountDetails)
        );


        /*
         * Temporary save button feedback
         */

        const saveButton =
            accountForm.querySelector(".mp-account-save");


        if (!saveButton) {
            return;
        }


        const originalText = saveButton.innerHTML;


        saveButton.innerHTML =
            '<i class="fa-solid fa-check"></i> Saved';


        setTimeout(function () {

            saveButton.innerHTML = originalText;

        }, 1500);

    });


    /*
     * Allow only numbers in mobile field
     */

    if (mobileInput) {

        mobileInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );

    }

});

document.addEventListener("DOMContentLoaded", function () {

    const navItems = document.querySelectorAll(
        ".mp-bottom-nav .mp-nav-item"
    );

    if (!navItems.length) return;

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    navItems.forEach(function (item) {

        const href = item.getAttribute("href");

        if (!href || href === "#") return;

        const linkPage =
            href
                .split("/")
                .pop()
                .split("?")[0]
                .toLowerCase();

        item.classList.remove("active");

        if (
            (currentPage === "index.html" && linkPage === "index.html") ||
            (currentPage === "category.html" && linkPage === "category.html") ||
            (currentPage === "account.html" && linkPage === "account.html")
        ) {
            item.classList.add("active");
        }

    });

});

/* =========================================================
   MESSENGER STYLE DRAGGABLE SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const floatingSearch =
        document.getElementById("mpFloatingSearch");

    const searchButton =
        document.getElementById("mpFloatingSearchButton");

    const searchPanel =
        document.getElementById("mpFloatingSearchPanel");

    const searchInput =
        document.getElementById("mpFloatingSearchInput");

    const searchClose =
        document.getElementById("mpFloatingSearchClose");

    if (
        !floatingSearch ||
        !searchButton
    ) {
        return;
    }


    /* =====================================================
       DEFAULT POSITION
    ===================================================== */

    const STORAGE_KEY =
        "mpFloatingSearchPosition";

    const BUTTON_SIZE = 54;

    let position = {
        right: 14,
        bottom: 82
    };


    /* =====================================================
       LOAD SAVED POSITION
    ===================================================== */

    try {

        const savedPosition =
            localStorage.getItem(STORAGE_KEY);

        if (savedPosition) {

            const saved =
                JSON.parse(savedPosition);

            if (
                typeof saved.right === "number" &&
                typeof saved.bottom === "number"
            ) {
                position = saved;
            }

        }

    } catch (error) {

        console.warn(
            "Unable to load floating search position.",
            error
        );

    }


    /* =====================================================
       APPLY POSITION
    ===================================================== */

    function applyPosition() {

        const maxRight =
            window.innerWidth - BUTTON_SIZE - 5;

        const maxBottom =
            window.innerHeight - BUTTON_SIZE - 5;

        position.right =
            Math.max(
                5,
                Math.min(
                    position.right,
                    maxRight
                )
            );

        position.bottom =
            Math.max(
                70,
                Math.min(
                    position.bottom,
                    maxBottom
                )
            );

        floatingSearch.style.right =
            position.right + "px";

        floatingSearch.style.bottom =
            position.bottom + "px";
    }


    applyPosition();


    /* =====================================================
       DRAG VARIABLES
    ===================================================== */

    let isDragging = false;

    let startX = 0;
    let startY = 0;

    let startRight = 0;
    let startBottom = 0;

    let moved = false;


    /* =====================================================
       POINTER DOWN
    ===================================================== */

    searchButton.addEventListener(
        "pointerdown",
        function (event) {

            if (window.innerWidth > 1024) {
                return;
            }

            isDragging = true;
            moved = false;

            startX = event.clientX;
            startY = event.clientY;

            startRight = position.right;
            startBottom = position.bottom;

            searchButton.setPointerCapture(
                event.pointerId
            );

            searchButton.style.cursor =
                "grabbing";

            event.preventDefault();

        }
    );


    /* =====================================================
       POINTER MOVE
    ===================================================== */

    searchButton.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }

            const deltaX =
                event.clientX - startX;

            const deltaY =
                event.clientY - startY;


            if (
                Math.abs(deltaX) > 5 ||
                Math.abs(deltaY) > 5
            ) {
                moved = true;
            }


            position.right =
                startRight - deltaX;

            position.bottom =
                startBottom - deltaY;


            applyPosition();

            event.preventDefault();

        }
    );


    /* =====================================================
       POINTER UP
    ===================================================== */

    searchButton.addEventListener(
        "pointerup",
        function () {

            if (!isDragging) {
                return;
            }

            isDragging = false;

            searchButton.style.cursor =
                "grab";


            /* Save position */

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(position)
                );

            } catch (error) {

                console.warn(
                    "Unable to save floating search position.",
                    error
                );

            }

        }
    );


    /* =====================================================
       OPEN SEARCH
    ===================================================== */

    searchButton.addEventListener(
        "click",
        function () {

            /*
             * If user dragged the button,
             * don't open search.
             */

            if (moved) {

                moved = false;

                return;
            }


            searchPanel.classList.add(
                "is-open"
            );


            setTimeout(
                function () {

                    if (searchInput) {
                        searchInput.focus();
                    }

                },
                100
            );

        }
    );


    /* =====================================================
       CLOSE SEARCH
    ===================================================== */

    if (searchClose) {

        searchClose.addEventListener(
            "click",
            function () {

                searchPanel.classList.remove(
                    "is-open"
                );

            }
        );

    }


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                searchPanel.classList.remove(
                    "is-open"
                );

            }

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 1024) {

                searchPanel.classList.remove(
                    "is-open"
                );

            }

            applyPosition();

        }
    );

});

/* =========================================================
   MESSENGER STYLE FLOATING SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const floatingSearch =
        document.getElementById("mpFloatingSearch");

    const searchButton =
        document.getElementById("mpFloatingSearchButton");

    const searchOverlay =
        document.getElementById("mpFloatingSearchOverlay");

    const searchPanel =
        document.getElementById("mpFloatingSearchPanel");

    const searchInput =
        document.getElementById("mpFloatingSearchInput");

    const searchClose =
        document.getElementById("mpFloatingSearchClose");

    const searchClear =
        document.getElementById("mpFloatingSearchClear");

    const recentList =
        document.getElementById("mpRecentSearchList");

    const recentSection =
        document.getElementById("mpRecentSearchSection");

    const clearRecent =
        document.getElementById("mpClearRecentSearch");


    if (
        !floatingSearch ||
        !searchButton ||
        !searchOverlay ||
        !searchPanel ||
        !searchInput
    ) {
        return;
    }


    /* =====================================================
       POSITION
    ===================================================== */

    const POSITION_KEY =
        "mpFloatingSearchPosition";

    const BUTTON_SIZE = 54;

    let position = {
        right: 14,
        bottom: 82
    };


    try {

        const savedPosition =
            localStorage.getItem(POSITION_KEY);

        if (savedPosition) {

            const saved =
                JSON.parse(savedPosition);

            if (
                typeof saved.right === "number" &&
                typeof saved.bottom === "number"
            ) {
                position = saved;
            }

        }

    } catch (error) {

        console.warn(
            "Unable to load search position.",
            error
        );

    }


    function applyPosition() {

        const maxRight =
            window.innerWidth -
            BUTTON_SIZE -
            5;

        const maxBottom =
            window.innerHeight -
            BUTTON_SIZE -
            5;


        position.right =
            Math.max(
                5,
                Math.min(
                    position.right,
                    maxRight
                )
            );


        position.bottom =
            Math.max(
                70,
                Math.min(
                    position.bottom,
                    maxBottom
                )
            );


        floatingSearch.style.right =
            position.right + "px";


        floatingSearch.style.bottom =
            position.bottom + "px";

    }


    applyPosition();


    /* =====================================================
       DRAG
    ===================================================== */

    let isDragging = false;

    let moved = false;

    let startX = 0;
    let startY = 0;

    let startRight = 0;
    let startBottom = 0;


    searchButton.addEventListener(
        "pointerdown",
        function (event) {

            if (window.innerWidth > 1024) {
                return;
            }

            isDragging = true;
            moved = false;

            startX = event.clientX;
            startY = event.clientY;

            startRight = position.right;
            startBottom = position.bottom;

            searchButton.setPointerCapture(
                event.pointerId
            );

            event.preventDefault();

        }
    );


    searchButton.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }


            const deltaX =
                event.clientX - startX;

            const deltaY =
                event.clientY - startY;


            if (
                Math.abs(deltaX) > 5 ||
                Math.abs(deltaY) > 5
            ) {

                moved = true;

            }


            position.right =
                startRight - deltaX;

            position.bottom =
                startBottom - deltaY;


            applyPosition();

            event.preventDefault();

        }
    );


    searchButton.addEventListener(
        "pointerup",
        function () {

            if (!isDragging) {
                return;
            }


            isDragging = false;


            try {

                localStorage.setItem(
                    POSITION_KEY,
                    JSON.stringify(position)
                );

            } catch (error) {

                console.warn(
                    "Unable to save search position.",
                    error
                );

            }

        }
    );


    /* =====================================================
       RECENT SEARCHES
    ===================================================== */

    const RECENT_KEY =
        "mpRecentSearches";

    const MAX_RECENT =
        6;


    function getRecentSearches() {

        try {

            const saved =
                localStorage.getItem(
                    RECENT_KEY
                );

            if (!saved) {
                return [];
            }

            const searches =
                JSON.parse(saved);

            return Array.isArray(searches)
                ? searches
                : [];

        } catch (error) {

            return [];

        }

    }


    function saveRecentSearch(value) {

        value =
            value.trim();

        if (!value) {
            return;
        }


        let searches =
            getRecentSearches();


        searches =
            searches.filter(
                function (item) {

                    return item.toLowerCase() !==
                        value.toLowerCase();

                }
            );


        searches.unshift(value);


        searches =
            searches.slice(
                0,
                MAX_RECENT
            );


        localStorage.setItem(
            RECENT_KEY,
            JSON.stringify(searches)
        );


        renderRecentSearches();

    }


    function renderRecentSearches() {

        if (!recentList) {
            return;
        }


        const searches =
            getRecentSearches();


        recentList.innerHTML = "";


        if (!searches.length) {

            recentList.innerHTML =
                '<span class="mp-recent-search-empty">' +
                'Your recent searches will appear here.' +
                '</span>';

            return;

        }


        searches.forEach(
            function (search) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "mp-recent-search-item";


                button.innerHTML =
                    '<i class="fa-solid fa-clock-rotate-left"></i>' +
                    '<span></span>';


                button
                    .querySelector("span")
                    .textContent = search;


                button.addEventListener(
                    "click",
                    function () {

                        searchInput.value =
                            search;

                        updateClearButton();

                        searchInput.focus();

                    }
                );


                recentList.appendChild(
                    button
                );

            }
        );

    }


    renderRecentSearches();


    /* =====================================================
       OPEN SEARCH
    ===================================================== */

    function openSearch() {

        searchOverlay.classList.add(
            "is-open"
        );

        document.body.classList.add(
            "mp-search-open"
        );


        setTimeout(
            function () {

                searchInput.focus();

            },
            250
        );

    }


    /* =====================================================
       CLOSE SEARCH
    ===================================================== */

    function closeSearch() {

        searchOverlay.classList.remove(
            "is-open"
        );

        document.body.classList.remove(
            "mp-search-open"
        );

    }


    searchButton.addEventListener(
        "click",
        function () {

            if (moved) {

                moved = false;

                return;

            }

            openSearch();

        }
    );


    if (searchClose) {

        searchClose.addEventListener(
            "click",
            closeSearch
        );

    }


    /* =====================================================
       CLICK OVERLAY
    ===================================================== */

    searchOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                searchOverlay
            ) {

                closeSearch();

            }

        }
    );


    /* =====================================================
       CLEAR INPUT
    ===================================================== */

    function updateClearButton() {

        if (!searchClear) {
            return;
        }


        if (
            searchInput.value.trim()
        ) {

            searchClear.classList.add(
                "is-visible"
            );

        } else {

            searchClear.classList.remove(
                "is-visible"
            );

        }

    }


    searchInput.addEventListener(
        "input",
        updateClearButton
    );


    if (searchClear) {

        searchClear.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                updateClearButton();

                searchInput.focus();

            }
        );

    }


    /* =====================================================
       SAVE SEARCH WHEN USER PRESSES ENTER
    ===================================================== */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const value =
                searchInput.value.trim();


            if (!value) {
                return;
            }


            saveRecentSearch(value);

            /*
             * Your existing product-search
             * functionality can be connected here.
             */

            searchInput.blur();

        }
    );


    /* =====================================================
       CLEAR ALL RECENT SEARCHES
    ===================================================== */

    if (clearRecent) {

        clearRecent.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    RECENT_KEY
                );

                renderRecentSearches();

            }
        );

    }


    /* =====================================================
       CATEGORY CLICK
    ===================================================== */

    const categoryButtons =
        document.querySelectorAll(
            ".mp-search-category"
        );


    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const value =
                        button.getAttribute(
                            "data-search"
                        );


                    if (!value) {
                        return;
                    }


                    searchInput.value =
                        value;


                    saveRecentSearch(
                        value
                    );


                    updateClearButton();

                    searchInput.focus();

                }
            );

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                searchOverlay.classList.contains(
                    "is-open"
                )
            ) {

                closeSearch();

            }

        }
    );


    /* =====================================================
       PREVENT BACKGROUND SCROLL
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            applyPosition();

        }
    );

});


/* =========================================================
   SHOPPING CART
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "mpCart";

    function getCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return Array.isArray(cart) ? cart : [];

        } catch (error) {
            return [];
        }
    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

        updateCartCount();
    }


    function updateCartCount() {

        const cart = getCart();

        const count = cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);


        document.querySelectorAll(".mp-cart-count").forEach(function (element) {
            element.textContent = count;
        });


        const bottomCount =
            document.getElementById("mpBottomCartCount");

        if (bottomCount) {
            bottomCount.textContent = count;
        }


        const cartItemsCount =
            document.getElementById("mpCartItemsCount");

        if (cartItemsCount) {
            cartItemsCount.textContent =
                count + (count === 1 ? " item" : " items");
        }
    }


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    document.querySelectorAll(".mp-product").forEach(function (product) {

        const addButton =
            product.querySelector(".mp-add");

        if (!addButton) {
            return;
        }


        addButton.addEventListener("click", function () {

            const name =
                product.dataset.product ||
                product.querySelector(".mp-product-name")?.textContent.trim();


            const activeOption =
                product.querySelector(".mp-size-option.active");


            if (!activeOption) {
                return;
            }


            const quantity =
                activeOption.dataset.quantity ||
                activeOption.textContent.trim();


            const price =
                Number(activeOption.dataset.price || 0);


            const image =
                product.querySelector(".mp-product-image");


            const emoji =
                image
                    ? image.textContent
                        .replace("BEST SELLER", "")
                        .replace("OFFER", "")
                        .replace("NEW", "")
                        .replace("♡", "")
                        .trim()
                        .split(/\s+/)
                        .pop()
                    : "🛒";


            let cart = getCart();


            const existingProduct =
                cart.find(function (item) {

                    return (
                        item.name === name &&
                        item.quantityLabel === quantity
                    );

                });


            if (existingProduct) {

                existingProduct.quantity += 1;

            } else {

                cart.push({
                    id:
                        Date.now().toString() +
                        Math.random().toString(16).slice(2),

                    name: name,

                    quantityLabel: quantity,

                    price: price,

                    quantity: 1,

                    image: emoji
                });

            }


            saveCart(cart);


            /* Small visual feedback */

            const oldText =
                addButton.textContent;

            addButton.textContent = "ADDED";

            addButton.classList.add("is-added");


            setTimeout(function () {

                addButton.textContent = oldText;

                addButton.classList.remove("is-added");

            }, 900);

        });

    });


    /* =====================================================
       CART PAGE
    ===================================================== */

    const cartItems =
        document.getElementById("mpCartItems");

    if (cartItems) {

        renderCart();

    }


    function renderCart() {

        const cart = getCart();

        const empty =
            document.getElementById("mpCartEmpty");

        const summary =
            document.getElementById("mpCartSummary");


        if (!cart.length) {

            cartItems.innerHTML = "";

            if (empty) {
                empty.hidden = false;
            }

            if (summary) {
                summary.hidden = true;
            }

            updateCartCount();

            return;
        }


        if (empty) {
            empty.hidden = true;
        }

        if (summary) {
            summary.hidden = false;
        }


        cartItems.innerHTML = "";


        cart.forEach(function (item) {

            const itemElement =
                document.createElement("div");

            itemElement.className =
                "mp-cart-item";


            itemElement.innerHTML = `

                <div class="mp-cart-item-image">
                    ${item.image || "🛒"}
                </div>

                <div class="mp-cart-item-info">

                    <div class="mp-cart-item-name">
                        ${escapeHtml(item.name)}
                    </div>

                    <div class="mp-cart-item-size">
                        ${escapeHtml(item.quantityLabel)}
                    </div>

                    <div class="mp-cart-item-price">
                        ₹${item.price}
                    </div>

                </div>

                <div class="mp-cart-quantity">

                    <button
                        type="button"
                        data-action="minus"
                        data-id="${item.id}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        data-action="plus"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="mp-cart-remove"
                    data-action="remove"
                    data-id="${item.id}"
                    aria-label="Remove product"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            `;


            cartItems.appendChild(itemElement);

        });


        updateCartSummary();

        updateCartCount();

    }


    /* =====================================================
       CART BUTTON ACTIONS
    ===================================================== */

    if (cartItems) {

        cartItems.addEventListener("click", function (event) {

            const button =
                event.target.closest("[data-action]");


            if (!button) {
                return;
            }


            const id =
                button.dataset.id;

            const action =
                button.dataset.action;


            let cart = getCart();


            const item =
                cart.find(function (cartItem) {

                    return cartItem.id === id;

                });


            if (!item) {
                return;
            }


            if (action === "plus") {

                item.quantity += 1;

            }


            if (action === "minus") {

                item.quantity -= 1;

                if (item.quantity <= 0) {

                    cart =
                        cart.filter(function (cartItem) {

                            return cartItem.id !== id;

                        });

                }

            }


            if (action === "remove") {

                cart =
                    cart.filter(function (cartItem) {

                        return cartItem.id !== id;

                    });

            }


            saveCart(cart);

            renderCart();

        });

    }


    /* =====================================================
       CART TOTAL
    ===================================================== */

    function updateCartSummary() {

        const cart = getCart();


        const subtotal =
            cart.reduce(function (total, item) {

                return total +
                    (item.price * item.quantity);

            }, 0);


        const subtotalElement =
            document.getElementById("mpCartSubtotal");

        const totalElement =
            document.getElementById("mpCartTotal");


        if (subtotalElement) {

            subtotalElement.textContent =
                "₹" + subtotal;

        }


        if (totalElement) {

            totalElement.textContent =
                "₹" + subtotal;

        }

    }


    /* =====================================================
       CART ICON → CART PAGE
    ===================================================== */

    document.querySelectorAll(".mp-cart-button").forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "cart.html";

        });

    });


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    updateCartCount();

});

document.addEventListener("DOMContentLoaded", function () {

    const navItems = document.querySelectorAll(".mp-nav-item");

    if (!navItems.length) return;

    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase() || "index.html";

    navItems.forEach(function (item) {

        const link = item.getAttribute("href");

        if (!link) return;

        const linkPage =
            link.split("/").pop().split("#")[0].toLowerCase();

        item.classList.remove("active");

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            item.classList.add("active");
        }

    });

});
