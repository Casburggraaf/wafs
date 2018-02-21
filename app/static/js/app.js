import router from "./modules/router.js";
import content from "./modules/content.js";

(function () {
  "use strict";
  // Init Aplication
  const app = {
    rootElement: document.body,
    init() {
      content.init();
      router.init();
    }
  };
  // Start the Aplication
  app.init();
})();
