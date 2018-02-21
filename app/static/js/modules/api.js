import data from "./data.js";

// Request and handle api calls
const api = {
  apiBasisUrl: "https://api.themoviedb.org/3/movie/",
  apiKey: "d9a167a57e748b4a804b41f0186b2339",
  requestPopular() {
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      // Making the url and creating a GET request
      const url = `${_this.apiBasisUrl}popular?api_key=${_this.apiKey}`;

      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Sets the JSON result in the data attribute
          data.dataPupular = JSON.parse(request.responseText);
          // Set a timestamp to the pupular page (this is for data refrech)
          data.dataPupular.timestamp = new Date();
          // Set popular movies into the localStorage
          localStorage.setItem(`popular`, JSON.stringify(data.dataPupular));

          // Create a object with filtered movies and convert released date
          data.filterBadMovies();
          data.releaseDateConvert();

          resolve();
        } else {
          reject(request.status); // Error handeling
        }
      };

      request.onerror = function () {
        reject("Failed to proform api req"); // Error handeling
      };

      request.send();
    });

    return promise;
  },
  requestDetail(movieiD) {
    const _this = this;
    // Makes a promise for the xml request
    const promise = new Promise(function(resolve, reject) {
      const request = new XMLHttpRequest();

      // Making the url and creating a GET request
      const url = `${_this.apiBasisUrl}${movieiD}?api_key=${_this.apiKey}`;

      request.open('GET', url, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Sets the JSON result in the data attribute
          data.dataDetail.temp = JSON.parse(request.responseText);
          // Create a object with propoty of the movie id in the data object
          data.dataDetail[data.dataDetail.temp.id] = data.dataDetail.temp;
          // Set detail of movie into the localStorage
          localStorage.setItem(`${data.dataDetail.temp.id}`, JSON.stringify(data.dataDetail.temp));

          resolve();
        } else {
          reject(request.status); // Error handeling
        }
      };

      request.onerror = function () {
        reject("Failed to proform api req"); // Error handeling
      };

      request.send();
    });

    return promise;
  }
};

export default api;
