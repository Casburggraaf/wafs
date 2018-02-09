// Create local scope
{
  'use strict'
  //Init Aplication
  const app = {
    init() {
      routers.init();
    },
    rootElement: document.body
  };

  // Handle routes and states
  const routers = {
    init() {
      // Check if the window already has a hash and change active sections corspodending the hash
      location.hash && sections.toggle(location.hash.substr(1));

      // Listing to hashchange
      hashchange = () => {
        var route = location.hash.substr(1);
        sections.toggle(route);
      };
    }
  }

  // Render / toggle sections
  const sections = {
    sections: app.rootElement.querySelectorAll("body>section"),
    toggle(route) {
      for (let i = 0; i < this.sections.length; i++) {
        this.sections[i].classList.remove("active");
        // Checking if the id is the same as the route
        if (this.sections[i].id == route) {
          this.sections[i].classList.add("active");
        }
      }
    }
  }

  // Start the Aplication
  app.init();
};