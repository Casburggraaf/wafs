// Create local scope
(function() {
  // Init Aplication
  const app = {
    init() {
      routers.init();
      sections.init();
    },
    rootElement: document.body
  };

  // Handle routes and states
  const routers = {
    init() {
      // Make routie config and requesting a xhr if needed
      routie({
        start: function() {
          sections.toggle("start");
        },
        popular: function() {
          sections.toggle("popular", "popular");
          // Fills the pages with data from the API except on the startpage
          sections.loadPage("popular", "popular")
        },
        // Get movie IDs and add it as second parameter in section.toggle
        "movie/:movieId": function (movieId) {
          sections.toggle("movieDetail", movieId);
          // Fills the pages with data from the API except on the startpage
          sections.loadPage("movieDetail", movieId);
        }
      });
    }
  };

  // Render / toggle sections
  const sections = {
    sectionsElements: app.rootElement.querySelectorAll("body>section"),
    init(){
      // A event listener on the button, refreshes page
      this.sectionsElements[1].querySelector('#popular input').addEventListener("change",function () {
        xhr.filterBadMoviesCheck = this.checked;
        sections.renderPage("popular", "popular");
      });
    },
    toggle(route, routeId) {
      // Sets the correct section to 'active'
      this.sectionsElements.forEach(function (el) {
        el.classList.remove("active");
        if (el.id === route) {
          el.classList.add("active");
        }
      });
    },
    loadPage(route, routeId){
      // Makes an api request
      xhr.request(routeId).then(function(){
        // Renders the page after the api call resolves
        sections.renderPage(route, routeId);
      });
    },
    renderPage(route, apiSearchParm) {
      if (apiSearchParm === "popular") {
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

        var target = this.sectionsElements[1].querySelector('#popularMovies');
        // Render Page (and check if filterd option is check if so show filterd data)
        if (xhr.filterBadMoviesCheck) {
          Transparency.render(target, xhr.dataFilterd.results, directives);
        } else {
          Transparency.render(target, xhr.data.results, directives);
        }

      } else if (route === "movieDetail"){
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

        var target = this.sectionsElements[2].querySelector('#movieDetails');
        // Render Page
        Transparency.render(target, xhr.data, directives);
      }
    }
  };

  const xhr = {
    apiBasisUrl: "https://api.themoviedb.org/3/movie/",
    apiKey: "d9a167a57e748b4a804b41f0186b2339",
    data: {},
    dataFilterd: {},
    filterBadMoviesCheck: false,
    request(apiSearchParm){
      var _this = this;
      // Makes a promise for the xml request
      var promise = new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        // Making the url and creating a GET request
        var url = `${_this.apiBasisUrl}${apiSearchParm}?api_key=${_this.apiKey}`;

        request.open('GET', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Sets the JSON result in the data attribute
            _this.data = JSON.parse(request.responseText);
            // Checking if it a popular Search or Movie detail page
            if (apiSearchParm === "popular") {
              _this.filterBadMovies();
              _this.releaseDateConvert();
            }
            resolve();
          }
        };
        request.send();
      });

      return promise;
    },
    filterBadMovies(){
      // filtering if vote average is smaller than 6.5
      this.dataFilterd.results = this.data.results.filter(function(obj){
        if (obj.vote_average > 6.5) {
          return true;
        }
      });
    },
    releaseDateConvert(){
      this.data.results = this.data.results.map(function(obj) {
        obj.release_date = utils.calcReleaseDate(obj.release_date);
        return obj;
      });
    }
  };

  const utils = {
    calcReleaseDate(date) {
      date = date.split("-");
      date = new Date(date[0], parseInt(date[1] - 1), date[2]);
      var days = Math.floor((new Date() - date) / 86400000);
      return days;
    },
  };

  // Start the Aplication
  app.init();
})();
