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

// RFQ form: AJAX submit with success redirect + error handling (progressive enhancement)
(function () {
  "use strict";
  function initRfqForms() {
    document.querySelectorAll("form.rfq-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var status = form.querySelector(".form-status");
        var next = form.querySelector('input[name="_next"]');
        var nextUrl = next ? next.value : "/thanks/";
        if (status) { status.hidden = true; status.textContent = ""; status.className = "form-status"; }

        // Honeypot guard: if a bot filled the hidden field, silently redirect as if OK.
        var gotcha = form.querySelector('input[name="_gotcha"]');
        if (gotcha && gotcha.value) { window.location.href = nextUrl; return; }

        if (btn) btn.disabled = true;

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            if (res.ok) { window.location.href = nextUrl; return; }
            return res.json().catch(function () { return {}; }).then(function (data) {
              var msg = "Submission failed. Please try again or email us directly.";
              if (data && data.errors && data.errors.length) {
                msg = data.errors.map(function (x) { return x.message; }).join(" ");
              } else if (data && data.error) {
                msg = data.error;
              }
              throw new Error(msg);
            });
          })
          .catch(function (err) {
            if (btn) btn.disabled = false;
            if (status) {
              status.textContent = (err && err.message) ? err.message : "Submission failed. Please try again or email us directly.";
              status.hidden = false;
              status.className = "form-status form-status--error";
            }
          });
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRfqForms);
  } else {
    initRfqForms();
  }
})();
