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
      // Make routie config and requesting a api if needed
      routie({
        start: function() {
          content.toggle("start");
        },
        popular: function() {
          content.toggle("popular");
          data.checkDataSourcePopular();
        },
        // Get movie IDs and add it as second parameter in section.toggle
        "movie/:movieId": function (movieId) {
          content.toggle("movieDetail");
          data.checkDataSourceDetail(movieId)
        },
        "error": function(){
          content.toggle("error");
        },
        "*": function(){
          content.toggle("page404");
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
      _this = this;

      this.sectionsElements[1].querySelector('#popular input').addEventListener("change",function () {
        _this.filterBadMoviesCheck = this.checked;
        template.renderPupular();
      });
    },
    toggle(route) {
      // Sets the correct section to 'active'
      this.sectionsElements.forEach(function (el) {
        el.classList.remove("active");
        if (el.id === route) {
          el.classList.add("active");
        }
      });
    },
    getPage(route, movieiD){
      // Makes an api request
      if (route == "popular") {
        api.requestPopular().then(function(){
          // Renders the page after the api call resolves
          template.renderPupular();
        }).catch(function(){
          content.togle("error");
          document.querySelector('#error p').appendChild(document.createTextNode(`There is propuly a problem with the api, please try again, error: ${error}`));
        });
      } else if(route == "movieDetail"){
        api.requestDetail(movieiD).then(function(){
          // Renders the page after the api call resolves
          template.renderDetail(movieiD);
        }).catch(function(error){
          content.toggle("error");
          document.querySelector('#error p').appendChild(document.createTextNode(`There is propuly a problem with the api, please try again, error: ${error}`));
        });
      }
    }
  };

  const api = {
    apiBasisUrl: "https://api.themoviedb.org/3/movie/",
    apiKey: "d9a167a57e748b4a804b41f0186b2339",
    requestPopular(){
      var _this = this;
      // Makes a promise for the xml request
      var promise = new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        // Making the url and creating a GET request
        var url = `${_this.apiBasisUrl}popular?api_key=${_this.apiKey}`;

        request.open('GET', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Sets the JSON result in the data attribute
            data.dataPupular = JSON.parse(request.responseText);
            data.dataPupular.timestamp = new Date;
            localStorage.setItem(`popular`, JSON.stringify(data.dataPupular));
            data.filterBadMovies();
            data.releaseDateConvert();

            resolve();
          } else {
            reject(request.status);
          }
        };

        request.send();
      });

      request.onerror = function() {
        reject("Failed to proform api req");
      };

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
            data.dataDetail[data.dataDetail.temp.id] = data.dataDetail.temp;
            localStorage.setItem(`${data.dataDetail.temp.id}`, JSON.stringify(data.dataDetail.temp));

            resolve();
          } else {
            reject(request.status);
          }
        };

        request.onerror = function() {
          reject("Failed to proform api req");
        };

        request.send();
      });

      return promise;
    }
  };

  const data = {
    dataPupular: {},
    dataPupularFilterd: {},
    dataDetail: {},
    filterBadMovies(){
      // filtering if vote average is smaller than 6.5
      data.dataPupularFilterd.results = data.dataPupular.results.filter(function(obj){
        if (obj.vote_average > 6.5) {
          return true;
        }
      });
    },
    releaseDateConvert(){
      data.dataPupular.results = data.dataPupular.results.map(function(obj) {
        obj.release_date = utils.calcReleaseDate(obj.release_date);
        return obj;
      });
    },
    checkDataSourcePopular(){
      if(Object.getOwnPropertyNames(this.dataPupular).length != 0) {
        template.renderPupular();
      } else if (localStorage.getItem("popular")){
        let temp = JSON.parse(localStorage.getItem("popular"));
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

  const template = {
    renderPupular(){
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
      var target = content.sectionsElements[1].querySelector('#popularMovies');
      // Render Page (and check if filterd option is check if so show filterd data)
      if (content.filterBadMoviesCheck) {
        Transparency.render(target, data.dataPupularFilterd.results, directives);
      } else {
        Transparency.render(target, data.dataPupular.results, directives);
      }
    },
    renderDetail(movieId){
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
      var target = content.sectionsElements[2].querySelector('#movieDetails');
      // Render Page
      Transparency.render(target, data.dataDetail[movieId], directives);
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
