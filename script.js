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
