document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SCROLL ANIMATION
    ========================= */

    const animationSelector = [
        ".page-section",
        ".page-section .info-card",
        ".page-section .faculty-page-card",
        ".page-section .gallery-item",
        ".page-section .gallery-empty"
    ].join(", ");

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -30px"
    });

    document.body.classList.add("reveal-enabled");

    function prepareAnimatedElements() {

        document.querySelectorAll(animationSelector).forEach(function (element, index) {

            if (element.classList.contains("reveal-item")) {
                return;
            }

            element.classList.add("reveal-item");
            element.style.transitionDelay = `${(index % 4) * 90}ms`;
            observer.observe(element);

        });

    }

    prepareAnimatedElements();

    const contentObserver = new MutationObserver(prepareAnimatedElements);

    contentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

});