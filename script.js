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