import template from "./template.js";
import content from "./content.js";
import utils from "./utils.js";

// Data holder and some function for data manupulation
const data = {
  dataPupular: {},
  dataPupularFilterd: {},
  dataDetail: {},
  filterBadMovies() {
    // Filtering if vote average is smaller than 6.5 and putting it into a sepperate object
    data.dataPupularFilterd.results = data.dataPupular.results.filter(function(obj) {
      if (obj.vote_average > 6.5) {
        return true;
      }
    });
  },
  releaseDateConvert() {
    // Convert the release date to x days ago
    data.dataPupular.results = data.dataPupular.results.map(function (obj) {
      obj.release_date = utils.calcReleaseDate(obj.release_date);
      return obj;
    });
  },
  checkDataSourcePopular() {
    // Checker if content is avible in the ram->localStorage and otherwise do a api request
    if (Object.getOwnPropertyNames(this.dataPupular).length !== 0) {
      template.renderPupular();
    } else if (localStorage.getItem("popular")) {
      const temp = JSON.parse(localStorage.getItem("popular"));
      // Checking if localStorage is older than x(miliSec) ago
      if ((new Date() - new Date(temp.timestamp)) < 60000) {
        this.dataPupular = temp;
        this.filterBadMovies();
        template.renderPupular();
      } else {
        content.getPage("popular");
      }
    } else {
      content.getPage("popular");
    }
  },
  checkDataSourceDetail(movieId) {
    // Checker if content is avible in the ram->localStorage and otherwise do a api request
    if (this.dataDetail[movieId]) {
      template.renderDetail(movieId);
    } else if (localStorage.getItem(movieId) !== null) {
      this.dataDetail[movieId] = JSON.parse(localStorage.getItem(movieId));
      template.renderDetail(movieId);
    } else {
      content.getPage("movieDetail", movieId);
    }
  }
};

export default data;
