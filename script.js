
const API_URL =
    (window.VISHNU_CONFIG && window.VISHNU_CONFIG.apiBaseUrl) ||
    document.querySelector('meta[name="api-base-url"]')?.content ||
    "https://vishnu-pcm-admin.onrender.com";

/* =====================================
   LOAD WEBSITE DATA
===================================== */

async function loadWebsiteData() {
    try {
        const response = await fetch(`${API_URL}/api/public`);

        if (!response.ok) {
            throw new Error("Failed to load website data");
        }

        const data = await response.json();

        renderFaculty(data.faculty || []);
        renderToppers(data.toppers || []);
        renderAlumni(data.alumni || []);
        renderReviews(
            (data.testimonials || []).filter(
                review => review.status === "approved"
            )
        );

        initScrollReveal();
    } catch (error) {
        console.error("Website data loading error:", error);

        showLoadError("facultyGrid");
        showLoadError("toppersGrid");
        showLoadError("alumniGrid");
        showLoadError("reviewsGrid");
    }
}

function showLoadError(containerId) {
    const container = document.getElementById(containerId);

    if (container) {
        container.innerHTML = `
            <div class="faculty-empty">
                <p>Unable to load content right now. Please try again later.</p>
            </div>
        `;
    }
}

/* =====================================
   IMAGE URL
===================================== */

function getImageUrl(photo) {
    if (!photo || typeof photo !== "string") {
        return "";
    }

    const value = photo.trim();

    if (!value) {
        return "";
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (value.startsWith("//")) {
        return `https:${value}`;
    }

    return `${API_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

/* =====================================
   IMAGE HTML
===================================== */

function createImage(photo, name, className = "") {
    const imageUrl = getImageUrl(photo);

    if (!imageUrl) {
        return "";
    }

    return `
        <img
            src="${escapeAttribute(imageUrl)}"
            alt="${escapeAttribute(name || "Student photo")}"
            class="${escapeAttribute(className)}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            width="300"
            height="300"
        >
    `;
}

/* Remove images that fail to load */
document.addEventListener("error", function (event) {
    const image = event.target;

    if (image instanceof HTMLImageElement) {
        image.classList.add("image-load-error");
        image.style.visibility = "hidden";
    }
}, true);

/* =====================================
   SCROLL REVEAL
===================================== */

function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        ".section-title, .course-card, " +
        ".faculty-card, .person-card, " +
        ".review-card, .review-submit-card, " +
        ".contact-container, .footer-grid"
    );

    if (!revealTargets.length) {
        return;
    }

    /* Prevent duplicate observer setup */
    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach(element => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.05,
            rootMargin: "0px 0px 50px 0px"
        }
    );

    revealTargets.forEach((element, index) => {
        element.classList.add("reveal-on-scroll");

        element.classList.add(
            element.classList.contains("section-title") ||
            element.classList.contains("contact-container") ||
            element.classList.contains("footer-grid")
                ? "fade-in"
                : "slide-in"
        );

        element.style.transitionDelay = `${(index % 4) * 50}ms`;

        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            element.classList.add("is-visible");
        } else {
            observer.observe(element);
        }
    });
}

/* =====================================
   FACULTY
===================================== */

function renderFaculty(faculty) {
    const container = document.getElementById("facultyGrid");

    if (!container) {
        return;
    }

    if (!faculty.length) {
        container.innerHTML = `
            <div class="faculty-empty">
                <h3>Faculty profiles coming soon</h3>
                <p>Our faculty information will be updated shortly.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = faculty.map(teacher => `
        <article class="faculty-card">
            <div class="faculty-photo">
                ${
                    teacher.photo
                        ? createImage(teacher.photo, teacher.name || "Faculty photo")
                        : `<div class="faculty-placeholder">👨‍🏫</div>`
                }
            </div>

            <div class="faculty-info">
                <span class="faculty-subject">
                    ${escapeHTML(teacher.subject || "")}
                </span>

                <h3>${escapeHTML(teacher.name || "")}</h3>

                <p>
                    ${escapeHTML(
                        teacher.description ||
                        "Dedicated to helping students understand concepts and improve their academic performance."
                    )}
                </p>
            </div>
        </article>
    `).join("");
}

/* =====================================
   TOPPERS
===================================== */

function renderToppers(toppers) {
    const container = document.getElementById("toppersGrid");

    if (!container) {
        return;
    }

    if (!toppers.length) {
        container.innerHTML = `
            <div class="person-card">
                <div class="person-info">
                    <div class="tag">ACHIEVERS</div>
                    <h3>Toppers Coming Soon</h3>
                    <p>New achievers will appear here.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = toppers.map(topper => `
        <article class="person-card">
            ${createImage(topper.photo, topper.name || "Topper photo")}

            <div class="person-info">
                <div class="tag">STUDENT ACHIEVER</div>

                <h3>${escapeHTML(topper.name || "")}</h3>

                ${
                    topper.details
                        ? `<div class="achievement-badges" aria-label="Student results and achievements">
                            ${String(topper.details)
                                .split(/\s*[|•;]\s*/)
                                .map(detail => detail.trim())
                                .filter(Boolean)
                                .map(detail => `<span class="achievement-badge">${escapeHTML(detail)}</span>`)
                                .join("")}
                        </div>`
                        : ""
                }

                ${
                    topper.review
                        ? `<p>“${escapeHTML(topper.review)}”</p>`
                        : ""
                }
            </div>
        </article>
    `).join("");
}

/* =====================================
   ALUMNI
===================================== */

function renderAlumni(alumni) {
    const container = document.getElementById("alumniGrid");

    if (!container) {
        return;
    }

    if (!alumni.length) {
        container.innerHTML = `
            <div class="person-card">
                <div class="person-info">
                    <div class="tag">ALUMNI</div>
                    <h3>Alumni Coming Soon</h3>
                    <p>Alumni profiles will appear here.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = alumni.map(person => `
        <article class="person-card">
            ${createImage(person.photo, person.name || "Alumni photo")}

            <div class="person-info">
                <div class="tag">ALUMNI</div>

                <h3>${escapeHTML(person.name || "")}</h3>

                <p>${escapeHTML(person.details || "")}</p>

                ${
                    person.review
                        ? `<p>“${escapeHTML(person.review)}”</p>`
                        : ""
                }
            </div>
        </article>
    `).join("");
}

/* =====================================
   APPROVED REVIEWS
===================================== */

function renderReviews(reviews) {
    const container = document.getElementById("reviewsGrid");

    if (!container) {
        return;
    }

    if (!reviews.length) {
        container.innerHTML = `
            <article class="review-card">
                <div class="stars">★★★★★</div>
                <p>Student and parent reviews will appear here.</p>
            </article>
        `;
        return;
    }

    container.innerHTML = reviews.map(review => `
        <article class="review-card">
            <span class="review-approved-label">APPROVED STUDENT REVIEW</span>
            <div class="stars">★★★★★</div>

            <p>“${escapeHTML(review.review || "")}”</p>

            <strong>${escapeHTML(review.name || "")}</strong>
        </article>
    `).join("");
}

/* =====================================
   PUBLIC REVIEW SUBMISSION
===================================== */

const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {
    reviewForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("reviewName");
        const reviewInput = document.getElementById("reviewText");
        const button = document.getElementById("reviewSubmitBtn");
        const message = document.getElementById("reviewMessage");

        if (!nameInput || !reviewInput || !button || !message) {
            return;
        }

        const name = nameInput.value.trim();
        const review = reviewInput.value.trim();

        if (!name || !review) {
            message.textContent = "Please enter your name and review.";
            message.className = "review-form-message error";
            return;
        }

        button.disabled = true;
        button.textContent = "Submitting...";
        message.textContent = "";

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("review", review);

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to submit review."
                );
            }

            message.textContent =
                "Thank you! Your review has been submitted and is waiting for admin approval.";

            message.className = "review-form-message success";

            reviewForm.reset();
        } catch (error) {
            console.error("Review submission error:", error);

            message.textContent =
                error.message || "Something went wrong. Please try again.";

            message.className = "review-form-message error";
        } finally {
            button.disabled = false;
            button.textContent = "Submit Review →";
        }
    });
}

/* =====================================
   WHATSAPP QUERY
===================================== */

const queryForm = document.getElementById("queryForm");

if (queryForm) {
    queryForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("queryName");
        const phoneInput = document.getElementById("queryPhone");
        const emailInput = document.getElementById("queryEmail");
        const messageInput = document.getElementById("queryMessage");
        const statusMessage = document.getElementById("queryFormMessage");
        const submitButton = queryForm.querySelector('button[type="submit"]');

        if (!nameInput || !phoneInput || !messageInput || !statusMessage || !submitButton) {
            return;
        }

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput.value.trim();
        const phoneDigits = phone.replace(/\D/g, "");

        statusMessage.textContent = "";
        statusMessage.className = "query-form-message";

        if (!queryForm.reportValidity()) {
            return;
        }

        if (name.length < 2 || phoneDigits.length < 7 || phoneDigits.length > 15 || message.length < 5) {
            statusMessage.textContent =
                "Please enter a name of at least 2 characters, a valid phone number, and a query of at least 5 characters.";
            statusMessage.classList.add("error");
            return;
        }

        const whatsappMessage = `Hello Vishnu PCM Classes,

I have a query regarding your coaching classes.

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}

Query:
${message}

Thank you.`;

        const whatsappURL =
            "https://wa.me/919451470559?text=" +
            encodeURIComponent(whatsappMessage);

        const whatsappWindow = window.open("about:blank", "_blank");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const response = await fetch(`${API_URL}/api/enquiries`, {
                method: "POST",
                body: new FormData(queryForm)
            });
            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    responseData.detail || "We couldn't save your enquiry. Please try again."
                );
            }

            queryForm.reset();
            statusMessage.textContent =
                "Your enquiry is saved. WhatsApp is opening so you can send it to our team.";
            statusMessage.classList.add("success");

            if (whatsappWindow && !whatsappWindow.closed) {
                whatsappWindow.opener = null;
                whatsappWindow.location.href = whatsappURL;
            } else {
                window.location.assign(whatsappURL);
            }
        } catch (error) {
            if (whatsappWindow && !whatsappWindow.closed) {
                whatsappWindow.close();
            }

            console.error("Enquiry submission error:", error);
            statusMessage.textContent =
                error.message || "Unable to send your enquiry. Please try again.";
            statusMessage.classList.add("error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Query →";
        }
    });
}

/* =====================================
   SECURITY HELPERS
===================================== */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function escapeAttribute(value) {
    return escapeHTML(value);
}

/* =====================================
   START WEBSITE
===================================== */

loadWebsiteData();
