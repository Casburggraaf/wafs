// Create local scope
(function() {
  // Init Aplication
  const app = {
    rootElement: document.body,
    init() {
      content.init();
      routers.init();
    }
  };

  // Handle routes and states
  const routers = {
    init() {
      // Routie config, toggle between pages and send request for data to data.checkDataSource
      routie({
        start: function() {
          content.toggle("start");
        },
        popular: function() {
          content.toggle("popular");
          data.checkDataSourcePopular();
        },
        // Get movie IDs and add it as parameter to checkDatasource
        "movie/:movieId": function (movieId) {
          content.toggle("movieDetail");
          data.checkDataSourceDetail(movieId)
        },
        "error": function(){
          content.toggle("error");
        },
        // Every other page will direct to a 404
        "*": function(){
          content.toggle("page404");
        }
      });
    }
  };

  // Render / toggle sections
  const content = {
    sectionsElements: app.rootElement.querySelectorAll("body>section"),
    filterBadMoviesCheck: false, // Boalen for filtering
    init(){
      // A event listener on the button, and reder it again
      _this = this;
      this.sectionsElements[1].querySelector('#popular input').addEventListener("change",function () {
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
    getPage(route, movieiD){
      this.showLoader(); // Set loader gif to active
      // Request a api by a call to promise api.request
      if (route == "popular") {
        api.requestPopular().then(function(){
          content.hideLoader(route);
          // Renders the page after the api call resolves
          template.renderPupular();
        }).catch(function(){
          // if error show error page and show error
          content.togle("error");
          document.querySelector('#error p').appendChild(document.createTextNode(`There is a posibile problem with the api, please try again, error: ${error}`));
        });
      } else if(route == "movieDetail"){
        api.requestDetail(movieiD).then(function(){
          content.hideLoader(route);
          // Renders the page after the api call resolves
          template.renderDetail(movieiD);
        }).catch(function(error){
          // if error show error page and show error
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
      if (route == "popular"){
        document.body.style.setProperty('--loader-status', 'none');
      }else if (route == "movieDetail") {
        // Only hide when the 2 images from te detail page are loaded
        let images = this.sectionsElements[2].querySelectorAll('img[data-bind]');
        let loadCount = 0;
        images.forEach(function (el) {
          // Set event listeren to the images
          el.addEventListener("load",function(){
            loadCount += 1;
            if(loadCount == images.length) {
              // Hide the loader
              document.body.style.setProperty('--loader-status', 'none');
            }
          });
        });
      }
    }
  }

// Request and handle api calls
  const api = {
    apiBasisUrl: "https://api.themoviedb.org/3/movie/",
    apiKey: "d9a167a57e748b4a804b41f0186b2339",
    requestPopular(){
      var _this = this;
      // Makes a promise for the XMLHttpRequest request
      var promise = new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        // Making the url and creating a GET request
        var url = `${_this.apiBasisUrl}popular?api_key=${_this.apiKey}`;

        request.open('GET', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Sets the JSON result in the data attribute
            data.dataPupular = JSON.parse(request.responseText);
            // Set a timestamp to the pupular page (this is for data refrech)
            data.dataPupular.timestamp = new Date;
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

        request.onerror = function() {
          reject("Failed to proform api req"); // Error handeling
        };

        request.send();
      });

      return promise;
    },
    requestDetail(movieiD){
      var _this = this;
      // Makes a promise for the xml request
      var promise = new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        // Making the url and creating a GET request
        var url = `${_this.apiBasisUrl}${movieiD}?api_key=${_this.apiKey}`;

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

        request.onerror = function() {
          reject("Failed to proform api req"); // Error handeling
        };

        request.send();
      });

      return promise;
    }
  };

// Data holder and some function for data manupulation
  const data = {
    dataPupular: {},
    dataPupularFilterd: {},
    dataDetail: {},
    filterBadMovies(){
      // filtering if vote average is smaller than 6.5 and putting it into a sepperate object
      data.dataPupularFilterd.results = data.dataPupular.results.filter(function(obj){
        if (obj.vote_average > 6.5) {
          return true;
        }
      });
    },
    releaseDateConvert(){
      // Convert the release date to x days ago
      data.dataPupular.results = data.dataPupular.results.map(function(obj) {
        obj.release_date = utils.calcReleaseDate(obj.release_date);
        return obj;
      });
    },
    checkDataSourcePopular(){
      // Checker if content is avible in the ram->localStorage and otherwise do a api request
      if(Object.getOwnPropertyNames(this.dataPupular).length != 0) {
        template.renderPupular();
      } else if (localStorage.getItem("popular")){
        let temp = JSON.parse(localStorage.getItem("popular"));
        // checking if localStorage is older than x(miliSec) ago
        if((new Date - new Date(temp.timestamp)) < 60000){
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
    checkDataSourceDetail(movieId){
      // Checker if content is avible in the ram->localStorage and otherwise do a api request
      if(this.dataDetail[movieId]){
        template.renderDetail(movieId);
      } else if(localStorage.getItem(movieId) != null) {
        this.dataDetail[movieId] = JSON.parse(localStorage.getItem(movieId));
        template.renderDetail(movieId);
      } else {
        content.getPage("movieDetail", movieId);
      }
    }
  }

// For rendering the templates
  const template = {
    renderPupular() {
      // Set href's or special text for templating
      var directives = {
        title: {
          href: function(params) {
            return `#movie/${this.id}`;
          },
          text: function (params) {
            return `${this.title} (${this.release_date} days old)`
          }
        }
      };
      // Set template target
      var target = content.sectionsElements[1].querySelector('#popularMovies');
      // Render Page (and check if filterd option is check if so show filterd data)
      if (content.filterBadMoviesCheck) {
        Transparency.render(target, data.dataPupularFilterd.results, directives);
      } else {
        Transparency.render(target, data.dataPupular.results, directives);
      }
    },
    renderDetail(movieId){
      content.showLoader();
      // Set href's, special text or src for templating
      var directives = {
        title: {
          href: function (params) {
            return `https://imdb.com/title/${this.imdb_id}`;
          },
          text: function (params) {
            return `${this.title}(${this.release_date.substring(0, 4)})`;
          }
        },
        poster_path: {
          src: function(params) {
            return `https://image.tmdb.org/t/p/w342/${this.poster_path}`;
          }
        },
        backdrop_path: {
          src: function(params) {
            return `https://image.tmdb.org/t/p/original/${this.backdrop_path}`;
          }
        }
      };
      // Set template target
      var target = content.sectionsElements[2].querySelector('#movieDetails');
      // Render Page
      Transparency.render(target, data.dataDetail[movieId], directives);
      // Set loader hide function on
      content.hideLoader("movieDetail");
    }
  };

  // Misc utitles
  const utils = {
    calcReleaseDate(date) {
      // A function for calc date(yyyy-mm-dd to days ago)
      date = date.split("-");
      date = new Date(date[0], parseInt(date[1] - 1), date[2]);
      var days = Math.floor((new Date() - date) / 86400000);
      return days;
    }
  };

  // Start the Aplication
  app.init();
})();
