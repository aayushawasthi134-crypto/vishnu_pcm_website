document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE HAMBURGER MENU
    ========================= */

    const menuBtn = document.querySelector(".menu-btn, .menu-toggle");
    const mainNav = document.getElementById("mainNav");
    const siteHeader = menuBtn && menuBtn.closest("header");

    if (menuBtn && mainNav && siteHeader) {

        const setMenuState = function (isOpen) {
            mainNav.classList.toggle("active", isOpen);
            mainNav.classList.toggle("open", isOpen);
            siteHeader.classList.toggle("mobile-open", isOpen);
            menuBtn.setAttribute("aria-expanded", String(isOpen));
            menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        };

        setMenuState(false);

        menuBtn.onclick = function (e) {

            e.preventDefault();
            e.stopPropagation();

            setMenuState(!mainNav.classList.contains("open"));

        };

        document.addEventListener("click", function (event) {
            if (event.target && !siteHeader.contains(event.target)) {
                setMenuState(false);
            }
        });

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.onclick = function () {
                setMenuState(false);
            };

        });

    }


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

            element.style.transitionDelay =
                `${(index % 4) * 90}ms`;

            observer.observe(element);

        });

    }


    prepareAnimatedElements();


    const contentObserver = new MutationObserver(
        prepareAnimatedElements
    );


    contentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

});
/* =========================================
   PUBLIC REVIEW SUBMISSION
========================================= */

const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {
    reviewForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("reviewName");
        const reviewInput = document.getElementById("reviewText");
        const button = document.getElementById("reviewSubmitBtn");
        const message = document.getElementById("reviewMessage");

        if (!nameInput || !reviewInput || !button || !message) {
            console.error("Review form elements are missing.");
            return;
        }

        const name = nameInput.value.trim();
        const review = reviewInput.value.trim();

        message.textContent = "";
        message.className = "review-form-message";

        if (!name || !review) {
            message.textContent = "Please enter your name and review.";
            message.className = "review-form-message error";
            return;
        }

        const originalButtonText = button.textContent;

        button.disabled = true;
        button.textContent = "Submitting...";

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("review", review);

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: "POST",
                body: formData
            });

            const responseText = await response.text();

            let data = {};

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.message ||
                    "Unable to submit your review. Please try again."
                );
            }

            message.textContent =
                "Thank you! Your review has been submitted and is waiting for admin approval.";

            message.className = "review-form-message success";

            reviewForm.reset();

        } catch (error) {
            console.error("Review submission error:", error);

            message.textContent =
                error.message ||
                "Something went wrong. Please try again.";

            message.className = "review-form-message error";

        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    });
}