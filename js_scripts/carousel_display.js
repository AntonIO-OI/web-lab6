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

    // Function to fetch and update carousel data
    function fetchCarouselData() {
        // Use AJAX to get data from the server
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Parse JSON response
                const data = JSON.parse(xhr.responseText);

                // Update the content in the carousel
                updateCarousel(data);
                carouselInstance.updateCarousel();
            }
        };
        xhr.open('GET', 'getData.php', true);
        xhr.send();
    }

    // Function to update the carousel with new data
    function updateCarousel(data) {
        // Reference to the carousel container
        var carouselContainer = document.getElementById('object-carousel');

        // Clear existing content
        carouselContainer.innerHTML = '';

        // Iterate through the data and create carousel items
        data.forEach(function (item) {
            var carouselItem = document.createElement('div');
            carouselItem.className = 'b-carousel__item';

            var imgElement = document.createElement('img');
            imgElement.src = item.imgLink;
            imgElement.alt = item.imgTitle;
            imgElement.className = 'b-carousel__img';

            var pElement = document.createElement('p');
            pElement.textContent = item.imgTitle;

            carouselItem.appendChild(imgElement);
            carouselItem.appendChild(pElement);

            carouselContainer.appendChild(carouselItem);
        });
    }

    // Fetch data initially
    fetchCarouselData();

    // Set up periodic data refresh (every 5 seconds in this example)
    setInterval(function() {fetchCarouselData();
            carouselInstance.updateCarousel();},
        5000);
})();