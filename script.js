const API_URL = "https://vishnu-pcm-admin.onrender.com";


/* =====================================
   LOAD WEBSITE DATA
===================================== */

async function loadWebsiteData() {

    try {

        const response = await fetch(
            `${API_URL}/api/public`
        );

        if (!response.ok) {
            throw new Error("Failed to load website data");
        }

        const data = await response.json();


        renderFaculty(
            data.faculty || []
        );


        renderToppers(
            data.toppers || []
        );


        renderAlumni(
            data.alumni || []
        );


        renderReviews(
            data.testimonials || []
        );


        initScrollReveal();

    }

    catch (error) {

        console.error(
            "Website data loading error:",
            error
        );

    }

}


/* =====================================
   IMAGE URL
===================================== */

function getImageUrl(photo) {

    if (!photo) {
        return "";
    }


    /*
       If Cloudinary or any full URL is already stored,
       use it directly.
    */

    if (
        photo.startsWith("http://") ||
        photo.startsWith("https://")
    ) {

        return photo;

    }


    /*
       For old local image paths such as:
       /static/uploads/image.jpg
    */

    return `${API_URL}${photo}`;

}


/* =====================================
   SCROLL REVEAL
===================================== */

function initScrollReveal() {

    const revealTargets =
        document.querySelectorAll(
            ".section-title, .course-card, " +
            ".faculty-card, .person-card, " +
            ".review-card, .contact-container, " +
            ".footer-grid"
        );


    if (!revealTargets.length) {
        return;
    }


    revealTargets.forEach(
        (element, index) => {

            element.classList.add(
                "reveal-on-scroll"
            );


            element.classList.add(

                element.classList.contains(
                    "section-title"
                ) ||

                element.classList.contains(
                    "contact-container"
                ) ||

                element.classList.contains(
                    "footer-grid"
                )

                    ? "fade-in"

                    : "slide-in"

            );


            element.style.transitionDelay =
                `${(index % 4) * 80}ms`;

        }
    );


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        revealTargets.forEach(
            element =>
                element.classList.add(
                    "is-visible"
                )
        );

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },

            {
                threshold: 0.14,
                rootMargin:
                    "0px 0px -35px"
            }

        );


    revealTargets.forEach(
        element =>
            observer.observe(element)
    );

}


/* =====================================
   FACULTY
===================================== */

function renderFaculty(
    faculty
) {

    const container =
        document.getElementById(
            "facultyGrid"
        );


    if (!container) {
        return;
    }


    if (!faculty.length) {

        container.innerHTML = `

            <div class="faculty-empty">

                <h3>
                    Faculty profiles coming soon
                </h3>

                <p>
                    Our faculty information
                    will be updated shortly.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =

        faculty.map(

            teacher => `

            <article
                class="faculty-card"
            >

                <div class="faculty-photo">

                    ${
                        teacher.photo

                        ?

                        `

                        <img
                            src="${getImageUrl(
                                teacher.photo
                            )}"
                            alt="${escapeHTML(
                                teacher.name
                            )}"
                        >

                        `

                        :

                        `

                        <div class="faculty-placeholder">
                            👨‍🏫
                        </div>

                        `
                    }

                </div>


                <div class="faculty-info">

                    <span class="faculty-subject">

                        ${escapeHTML(
                            teacher.subject || ""
                        )}

                    </span>


                    <h3>

                        ${escapeHTML(
                            teacher.name || ""
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            teacher.description ||

                            "Dedicated to helping students understand concepts and improve their academic performance."
                        )}

                    </p>

                </div>

            </article>

        `

        ).join("");

}


/* =====================================
   TOPPERS
===================================== */

function renderToppers(
    toppers
) {

    const container =
        document.getElementById(
            "toppersGrid"
        );


    if (!container) {
        return;
    }


    if (!toppers.length) {

        container.innerHTML = `

            <div class="person-card">

                <div class="person-info">

                    <div class="tag">
                        ACHIEVERS
                    </div>


                    <h3>
                        Toppers Coming Soon
                    </h3>


                    <p>
                        New achievers will
                        appear here.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =

        toppers.map(

            topper => `

            <article
                class="person-card"
            >

                ${
                    topper.photo

                    ?

                    `

                    <img
                        src="${getImageUrl(
                            topper.photo
                        )}"
                        alt="${escapeHTML(
                            topper.name
                        )}"
                    >

                    `

                    :

                    ""
                }


                <div class="person-info">

                    <div class="tag">
                        TOPPER
                    </div>


                    <h3>

                        ${escapeHTML(
                            topper.name || ""
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            topper.details || ""
                        )}

                    </p>


                    ${
                        topper.review

                        ?

                        `

                        <p>

                            “${escapeHTML(
                                topper.review
                            )}”

                        </p>

                        `

                        :

                        ""
                    }

                </div>

            </article>

        `

        ).join("");

}


/* =====================================
   ALUMNI
===================================== */

function renderAlumni(
    alumni
) {

    const container =
        document.getElementById(
            "alumniGrid"
        );


    if (!container) {
        return;
    }


    if (!alumni.length) {

        container.innerHTML = `

            <div class="person-card">

                <div class="person-info">

                    <div class="tag">
                        ALUMNI
                    </div>


                    <h3>
                        Alumni Coming Soon
                    </h3>


                    <p>
                        Alumni profiles will
                        appear here.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =

        alumni.map(

            person => `

            <article
                class="person-card"
            >

                ${
                    person.photo

                    ?

                    `

                    <img
                        src="${getImageUrl(
                            person.photo
                        )}"
                        alt="${escapeHTML(
                            person.name
                        )}"
                    >

                    `

                    :

                    ""
                }


                <div class="person-info">

                    <div class="tag">
                        ALUMNI
                    </div>


                    <h3>

                        ${escapeHTML(
                            person.name || ""
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            person.details || ""
                        )}

                    </p>


                    ${
                        person.review

                        ?

                        `

                        <p>

                            “${escapeHTML(
                                person.review
                            )}”

                        </p>

                        `

                        :

                        ""
                    }

                </div>

            </article>

        `

        ).join("");

}


/* =====================================
   REVIEWS
===================================== */

function renderReviews(
    reviews
) {

    const container =
        document.getElementById(
            "reviewsGrid"
        );


    if (!container) {
        return;
    }


    if (!reviews.length) {

        container.innerHTML = `

            <article
                class="review-card"
            >

                <div class="stars">
                    ★★★★★
                </div>


                <p>
                    Student and parent
                    reviews will appear here.
                </p>

            </article>

        `;

        return;

    }


    container.innerHTML =

        reviews.map(

            review => `

            <article
                class="review-card"
            >

                <div class="stars">
                    ★★★★★
                </div>


                <p>

                    “${escapeHTML(
                        review.review || ""
                    )}”

                </p>


                <strong>

                    ${escapeHTML(
                        review.name || ""
                    )}

                </strong>

            </article>

        `

        ).join("");

}


/* =====================================
   WHATSAPP QUERY
===================================== */

const queryForm =
    document.getElementById(
        "queryForm"
    );


if (queryForm) {

    queryForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "queryName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "queryPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "queryEmail"
                ).value.trim();


            const message =
                document.getElementById(
                    "queryMessage"
                ).value.trim();


            const whatsappNumber =
                "919451470559";


            const whatsappMessage =

`Hello Vishnu PCM Classes,

I have a query regarding your coaching classes.

Name: ${name}

Phone: ${phone}

Email: ${email || "Not provided"}

Query:
${message}

Thank you.`;


            const whatsappURL =

                "https://wa.me/" +

                whatsappNumber +

                "?text=" +

                encodeURIComponent(
                    whatsappMessage
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


/* =====================================
   SECURITY
===================================== */

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /[&<>"']/g,

            character => ({

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            }[character])

        );

}


/* =====================================
   START WEBSITE
===================================== */

loadWebsiteData();