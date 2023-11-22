(function() {
    "use strict";

    function Carousel(setting) {
        if(document.querySelector(setting.wrap) === null) {
            console.error(`Carousel not found selector ${setting.wrap}`);
            return;
        }

        let privates = {};

        this.prev_slide = () => {
            --privates.opt.position;

            if(privates.opt.position < 0) {
                privates.sel.wrap.classList.add('s-notransition');
                privates.opt.position = privates.opt.max_position - 1;
            }

            privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;
        };

        this.next_slide = () => {
            ++privates.opt.position;

            if(privates.opt.position >= privates.opt.max_position) {
                privates.opt.position = 0;
            }

            privates.sel.wrap.style["transform"] = `translateX(-${privates.opt.position}00%)`;
        };

        this.updateCarousel = () => {
            privates.sel.children = document.querySelector(privates.setting.wrap).children;
            privates.opt.max_position = privates.sel.children.length;
        };

        privates.setting = setting;

        privates.sel = {
            "main": document.querySelector(privates.setting.main),
            "wrap": document.querySelector(privates.setting.wrap),
            "children": document.querySelector(privates.setting.wrap).children,
            "prev": document.querySelector(privates.setting.prev),
            "next": document.querySelector(privates.setting.next)
        };

        privates.opt = {
            "position": 0,
            "max_position": privates.sel.children.length
        };

        if(privates.sel.prev !== null) {
            privates.sel.prev.addEventListener('click', () => {
                this.prev_slide();
            });
        }

        if(privates.sel.next !== null) {
            privates.sel.next.addEventListener('click', () => {
                this.next_slide();
            });
        }
    }

    let carouselInstance = new Carousel({
        "main": ".js-carousel",
        "wrap": ".js-carousel__wrap",
        "prev": ".js-carousel__prev",
        "next": ".js-carousel__next"
    });

    document.getElementById('generateForms').addEventListener('click', function() {
        let numObjects = document.getElementById('numObjects').value;
        const carouselWrap = document.querySelector('.js-carousel__wrap');

        if (numObjects > 50) {
            numObjects = 50;
        }

        carouselWrap.innerHTML = '';

        for (let i = 0; i < numObjects; i++) {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'b-carousel__item';

            carouselItem.innerHTML = `
                 <form class="carousel-form">
                 <p>Form for item ${i + 1}</p>
                    <input type="text" name="imgLink${i}" placeholder="Image Link">
                    <input type="text" name="imgTitle${i}" placeholder="Image Title" style="margin-bottom: 20px;">
                    <br>
                </form>
            `;
            carouselWrap.appendChild(carouselItem);
        }

        carouselInstance.updateCarousel();
    });

    document.getElementById('submitAllForms').addEventListener('click', function() {
        const forms = document.querySelectorAll('.carousel-form');

        let fetchPromises = [];

        forms.forEach(function(form, index) {
            const formData = {
                imgLink: form.querySelector(`input[name='imgLink${index}']`).value,
                imgTitle: form.querySelector(`input[name='imgTitle${index}']`).value
            };

            if (formData.imgLink !== "" && formData.imgTitle !== "") {
                let fetchPromise = fetch(formData.imgLink, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            console.log("URL IS REACHABLE");
                            return formData; // return the formData if URL is reachable
                        } else {
                            console.log("URL IS UNREACHABLE");
                            return null; // return null or some indicator for unreachable URL
                        }
                    })
                    .catch(error => {
                        console.log("Error or URL is not reachable");
                        return null; // return null or some indicator for error
                    });

                fetchPromises.push(fetchPromise);
            }
        });

        Promise.all(fetchPromises).then(results => {
            // Filter out null values (unreachable URLs)
            let validFormData = results.filter(data => data !== null);

            // 'validFormData' now contains only the formData objects where the imgLink was reachable
            console.log(validFormData);

            // Send data to server
            fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validFormData)
            })
                // .then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch((error) => console.error('Error:', error));
        });

        forms.forEach(form => {
            form.reset(); // This will clear each form
        });
    });
})();

function clearAllForms() {
    // Clear the forms container
    const carouselWrap = document.querySelector('.js-carousel__wrap');
    carouselWrap.innerHTML = '';

    // Reset the form count input
    const formCountInput = document.getElementById('numObjects');
    if (formCountInput) {
        formCountInput.value = 0;
    }
}

// Example usage
document.getElementById('clearFormsButton').addEventListener('click', clearAllForms);
