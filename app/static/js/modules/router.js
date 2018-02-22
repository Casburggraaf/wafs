import content from "./content.js";
import data from "./data.js";
import template from "./template.js";

// Handle routes and states
const router = {
  init() {
    // Routie config, toggle between pages and send request for data to data.checkDataSource
    routie({
      ""() {
        content.toggle("start");
        template.renderHome();
      },
      start() {
        content.toggle("start");
        template.renderHome();
      },
      popular() {
        content.toggle("popular");
        data.checkDataSourcePopular();
      },
      // Get movie IDs and add it as parameter to checkDatasource
      "movie/:movieId"(movieId) {
        content.toggle("movieDetail");
        data.checkDataSourceDetail(movieId);
      },
      error() {
        content.toggle("error");
      },
      // Every other page will direct to a 404
      "*"() {
        content.toggle("page404");
      }
    });
  }
};

export default router;
