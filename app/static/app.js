// Create local scope
(function() {
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
      if (window.location.hash) {
        sections.toggle(location.hash.substr(1));
      }

      // Listing to hashchange
      window.addEventListener("hashchange",function(){
        let route = location.hash.substr(1);
        sections.toggle(route);
      });
    }
  };

  // Render / toggle sections
  const sections = {
    sections: app.rootElement.querySelectorAll("body>section"),
    toggle(route) {
      this.sections.forEach(function(el) {
        el.classList.remove("active");
        // Checking if the id is the same as the route
        if (el.id === route) {
           el.classList.add("active");
        }
      });
    }
  };

  // Start the Aplication
  app.init();

})();
