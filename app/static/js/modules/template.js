import content from "./content.js";
import data from "./data.js";


// For rendering the templates
const template = {
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
    content.hideLoader("movieDetail");
  }
};

export default template;
