async function loadWebsiteData() {

    try {

        const response =
            await fetch(
                "/api/public"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load data"
            );

        }


        const data =
            await response.json();


        renderFaculty(
            data.faculty
        );


        renderToppers(
            data.toppers
        );


        renderAlumni(
            data.alumni
        );


        renderReviews(
            data.testimonials
        );

    }

    catch (error) {

        console.error(error);

    }

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
                            src="${teacher.photo}"
                            alt=""
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
                            teacher.subject
                        )}
                    </span>


                    <h3>
                        ${escapeHTML(
                            teacher.name
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

            <article class="person-card">

                ${
                    topper.photo
                    ?
                    `
                    <img
                        src="${topper.photo}"
                        alt=""
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
                            topper.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            topper.details ||
                            ""
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

            <article class="person-card">

                ${
                    person.photo
                    ?
                    `
                    <img
                        src="${person.photo}"
                        alt=""
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
                            person.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            person.details ||
                            ""
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


    if (!reviews.length) {

        container.innerHTML = `

            <article class="review-card">

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

            <article class="review-card">

                <div class="stars">
                    ★★★★★
                </div>


                <p>
                    “${escapeHTML(
                        review.review
                    )}”
                </p>


                <strong>
                    ${escapeHTML(
                        review.name
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


loadWebsiteData();