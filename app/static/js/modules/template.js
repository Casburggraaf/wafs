import content from "./content.js";
import data from "./data.js";
import utils from "./utils.js";


// For rendering the templates
const template = {
  renderHome() {
    content.showLoader();
    // Set img src
    const img = [
      {
        home_img: 'https://source.unsplash.com/23LET4Hxj_U/1600x900'
      },
      {
        home_img: 'https://source.unsplash.com/IkSjU7Ij2xk/1600x900'
      },
      {
        home_img: 'https://source.unsplash.com/4SLz_RCk6kQ/1600x900'
      }
    ];
    const directives = {
      home_img: {
        src() {
          return this.home_img;
        }
      }
    };
    // Set template target
    const target = content.sectionsElements[0];
    // Render Page
    Transparency.render(target, img[utils.randomNumberGen(img.length)], directives);
    // Set loader hide function on
    content.hideLoader();
  },
  renderPupular() {
    // Set href's or special text for templating
    const directives = {
      title: {
        href() {
          return `#movie/${this.id}`;
        },
        text() {
          return `${this.title} (${this.release_date} days old)`;
        }
      }
    };
    // Set template target
    const target = content.sectionsElements[1].querySelector('#popularMovies');
    // Render Page (and check if filterd option is check if so show filterd data)
    if (content.filterBadMoviesCheck) {
      Transparency.render(target, data.dataPupularFilterd.results, directives);
    } else {
      Transparency.render(target, data.dataPupular.results, directives);
    }
  },
  renderDetail(movieId) {
    content.showLoader();
    // Set href's, special text or src for templating
    const directives = {
      title: {
        href() {
          return `https://imdb.com/title/${this.imdb_id}`;
        },
        text() {
          return `${this.title}(${this.release_date.substring(0, 4)})`;
        }
      },
      poster_path: {
        src() {
          return `https://image.tmdb.org/t/p/w342/${this.poster_path}`;
        }
      },
      backdrop_path: {
        src() {
          return `https://image.tmdb.org/t/p/original/${this.backdrop_path}`;
        }
      }
    };
    // Set template target
    const target = content.sectionsElements[2].querySelector('#movieDetails');
    // Render Page
    Transparency.render(target, data.dataDetail[movieId], directives);
    // Set loader hide function on
    content.hideLoader();
  }
};

export default template;
