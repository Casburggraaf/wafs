import api from "./api.js";
import template from "./template.js";

// Render / toggle sections
const content = {
  sectionsElements: document.querySelectorAll("body>section"),
  filterBadMoviesCheck: false, // Boalen for filtering
  init() {
    // A event listener on the button, and reder it again
    const _this = this;
    this.sectionsElements[1].querySelector('#popular input').addEventListener("change", function() {
      _this.filterBadMoviesCheck = this.checked;
      template.renderPupular();
    });
  },
  toggle(route) {
    // Sets the correct section to 'active'matches by iD
    this.sectionsElements.forEach(function (el) {
      el.classList.remove("active");
      if (el.id === route) {
        el.classList.add("active");
      }
    });
  },
  getPage(route, movieiD) {
    this.showLoader(); // Set loader gif to active
    // Request a api by a call to promise api.request
    if (route === "popular") {
      api.requestPopular().then(function () {
        content.hideLoader(route);
        // Renders the page after the api call resolves
        template.renderPupular();
      }).catch(function (error) {
        // If error show error page and show error
        content.togle("error");
        document.querySelector('#error p').appendChild(document.createTextNode(`There is a posibile problem with the api, please try again, error: ${error}`));
      });
    } else if (route === "movieDetail") {
      api.requestDetail(movieiD).then(function () {
        content.hideLoader(route);
        // Renders the page after the api call resolves
        template.renderDetail(movieiD);
      }).catch(function (error) {
        // If error show error page and show error
        content.toggle("error");
        document.querySelector('#error p').appendChild(document.createTextNode(`There is a posibile problem with the api, please try again, error: ${error}`));
      });
    }
  },
  showLoader() {
    // Set css varibale to show loader gif
    document.body.style.setProperty('--loader-status', 'block');
  },
  hideLoader(route) {
    // Hide loader gif
    if (route === "popular") {
      document.body.style.setProperty('--loader-status', 'none');
    } else if (route === "movieDetail") {
      // Only hide when the 2 images from te detail page are loaded
      const images = this.sectionsElements[2].querySelectorAll('img[data-bind]');
      let loadCount = 0;
      images.forEach(function (el) {
        // Set event listeren to the images
        el.addEventListener("load", function () {
          loadCount += 1;
          if (loadCount === images.length) {
            // Hide the loader
            document.body.style.setProperty('--loader-status', 'none');
          }
        });
        el.addEventListener("error", function () {
          content.toggle("error");
          document.querySelector('#error p').appendChild(document.createTextNode(`There is a posibile problem with image CDN`));
        });
      });
    }
  }
};

export default content;