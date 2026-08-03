// cabinet.github.io — minimal UI behaviour
(function () {
  "use strict";
  // Close mobile nav after selecting a link
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = document.getElementById("nav-toggle");
      if (t) t.checked = false;
    });
  });
})();
