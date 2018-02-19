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
      // Make routie config and requesting a xhr if needed
      routie({
        start: function() {
          content.toggle("start");
        },
        popular: function() {
          content.toggle("popular", "popular");
          // Fills the pages with data from the API
          if(Object.getOwnPropertyNames(xhr.dataPupular).length != 0) {
            content.renderPage("popular", "popular");
          } else if (localStorage.getItem("popular")){
            let temp = JSON.parse(localStorage.getItem("popular"));
            console.log((new Date - new Date(temp.timestamp)));
            if((new Date - new Date(temp.timestamp)) < 60000){
              xhr.dataPupular = temp;
              xhr.filterBadMovies();
              content.renderPage("popular", "popular");
            } else {
              content.loadPage("popular", "popular");
            }
          } else {
            content.loadPage("popular", "popular");
          }
        },
        // Get movie IDs and add it as second parameter in section.toggle
        "movie/:movieId": function (movieId) {
          content.toggle("movieDetail", movieId);
          // Fills the pages with data from the API
          if(xhr.dataDetail[movieId]){
            content.renderPage("movieDetail", movieId);
          } else if(localStorage.getItem(movieId) != null) {
            xhr.dataDetail[movieId] = JSON.parse(localStorage.getItem(movieId));
            content.renderPage("movieDetail", movieId);
          } else {
            content.loadPage("movieDetail", movieId);
          }
        }
      });
    }
  };

  // Render / toggle sections
  const content = {
    sectionsElements: app.rootElement.querySelectorAll("body>section"),
    filterBadMoviesCheck: false,
    init(){
      // A event listener on the button, refreshes page
      this.sectionsElements[1].querySelector('#popular input').addEventListener("change",function () {
        content.filterBadMoviesCheck = this.checked;
        content.renderPage("popular", "popular");
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
        content.renderPage(route, routeId);
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
        if (this.filterBadMoviesCheck) {
          Transparency.render(target, xhr.dataPupularFilterd.results, directives);
        } else {
          Transparency.render(target, xhr.dataPupular.results, directives);
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
        Transparency.render(target, xhr.dataDetail[apiSearchParm], directives);
      }
    },
  };

  const xhr = {
    apiBasisUrl: "https://api.themoviedb.org/3/movie/",
    apiKey: "d9a167a57e748b4a804b41f0186b2339",
    dataPupular: {},
    dataPupularFilterd: {},
    dataDetail: {},
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

            // Checking if it a popular Search or Movie detail page
            if (apiSearchParm === "popular") {
              _this.dataPupular = JSON.parse(request.responseText);
              _this.dataPupular.timestamp = new Date;
              console.log(_this.dataPupular.timestamp);
              localStorage.setItem(`popular`, JSON.stringify(_this.dataPupular));
              _this.filterBadMovies();
              _this.releaseDateConvert();
            } else {
              _this.dataDetail.temp = JSON.parse(request.responseText);
              _this.dataDetail[_this.dataDetail.temp.id] = _this.dataDetail.temp;
              localStorage.setItem(`${_this.dataDetail.temp.id}`, JSON.stringify(_this.dataDetail.temp));
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
      this.dataPupularFilterd.results = this.dataPupular.results.filter(function(obj){
        if (obj.vote_average > 6.5) {
          return true;
        }
      });
    },
    releaseDateConvert(){
      this.dataPupular.results = this.dataPupular.results.map(function(obj) {
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
    }
  };

  // Start the Aplication
  app.init();
})();
