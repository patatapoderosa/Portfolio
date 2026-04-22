(function () {
  var body = document.body;
  if (!body) return;

  var TRANSITION_KEY = "mirror-page-transition";
  var DURATION_MS = 520;
  var overlay = document.createElement("div");
  overlay.className = "page-transition-overlay";
  body.appendChild(overlay);

  var origin = window.location.origin;

  if (
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/index.html")
  ) {
    body.classList.add("home-page");
  }

  if (
    window.location.pathname === "/work" ||
    window.location.pathname.endsWith("/work.html")
  ) {
    body.classList.add("work-page");
  }

  function isInternalLink(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.href.indexOf(origin) !== 0) return false;

    var path = anchor.getAttribute("href") || "";
    if (path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) {
      return false;
    }

    return true;
  }

  function startEntryTransition() {
    if (sessionStorage.getItem(TRANSITION_KEY) !== "pending") return;

    sessionStorage.removeItem(TRANSITION_KEY);
    body.classList.add("page-transition-enter", "page-transition-entering");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.classList.add("page-transition-enter-active");
        body.classList.remove("page-transition-enter");
        window.setTimeout(function () {
          body.classList.remove("page-transition-entering", "page-transition-enter-active");
        }, 760);
      });
    });
  }

  startEntryTransition();

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createHeroBlock(className, tagName, text) {
    var wrapper = document.createElement("div");
    wrapper.className = className + " hero-below-video hero-reveal";
    wrapper.setAttribute("data-hero-reveal", "true");

    var overflow = document.createElement("div");
    overflow.className = "overflow-hidden";

    var heading = document.createElement(tagName);
    heading.className = "hero-main hero-main-single hero-reveal-line";
    heading.setAttribute("data-hero-line", "0");
    heading.textContent = text;

    overflow.appendChild(heading);
    wrapper.appendChild(overflow);
    return wrapper;
  }

  function syncHeroBelowVideo() {
    var heroText = "CIAO! SONO CARMINE";

    Array.prototype.forEach.call(
      document.querySelectorAll(".hero-copy-mobile, .hero-copy-desktop"),
      function (node) {
        node.setAttribute("aria-hidden", "true");
      }
    );

    var desktopIntro = document.querySelector("section.intro");
    var desktopVideo = desktopIntro && desktopIntro.querySelector(".video-preview");
    if (desktopIntro && desktopVideo && !desktopIntro.querySelector(".hero-below-video-desktop")) {
      desktopVideo.insertAdjacentElement(
        "afterend",
        createHeroBlock("hero-below-video-desktop", "h2", heroText)
      );
    }
  }

  function syncHomeHeader() {
    Array.prototype.forEach.call(document.querySelectorAll("header"), function (header) {
      header.remove();
    });
  }

  function watchHomeHeader() {
    var observer = new MutationObserver(function () {
      syncHomeHeader();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    syncHomeHeader();
  }

  function syncMenuContactButton() {
    var socials = document.querySelector(".menu-socials");
    if (!socials || socials.querySelector(".menu-cta-link")) return;

    var contactLink = document.createElement("a");
    contactLink.className = "menu-cta-link";
    contactLink.href = "mailto:carmine@carnevale.dev";
    contactLink.setAttribute("aria-label", "Mandami una email");
    contactLink.innerHTML =
      '<div class="menu-cta-text-window">' +
      '<div class="menu-cta-text-track">' +
      "<span>Contattami</span>" +
      "<span>Contattami</span>" +
      "</div>" +
      "</div>";

    socials.insertAdjacentElement("afterbegin", contactLink);
  }

  function initHeroScrollReveal() {
    var revealGroups = Array.prototype.slice.call(
      document.querySelectorAll("[data-hero-reveal]")
    );
    if (!revealGroups.length) return;
    revealGroups.forEach(function (group) {
      Array.prototype.forEach.call(
        group.querySelectorAll("[data-hero-line]"),
        function (line) {
          var text = (line.textContent || "").replace(/\s+/g, " ").trim();
          if (!text) return;
          line.setAttribute("aria-label", text);
          line.classList.add("hero-reveal-text");
          line.textContent = "";

          Array.prototype.forEach.call(text, function (character, charIndex) {
            var span = document.createElement("span");
            span.className = character === " " ? "hero-letter hero-space" : "hero-letter";
            span.setAttribute("data-char-index", String(charIndex));
            span.textContent = character === " " ? "\u00A0" : character;
            line.appendChild(span);
          });
        }
      );
    });

    body.classList.add("hero-scroll-ready");

    var ticking = false;

    function updateHeroReveal() {
      ticking = false;
      var viewportHeight = window.innerHeight || 1;

      revealGroups.forEach(function (group) {
        var rect = group.getBoundingClientRect();
        var travel = Math.max(rect.height, viewportHeight) * 1.18;
        var progress = (-rect.top + viewportHeight * 0.7) / travel;
        progress = clamp(progress, 0, 1);

        Array.prototype.forEach.call(
          group.querySelectorAll("[data-hero-line]"),
          function (line) {
            var lineIndex = Number(line.getAttribute("data-hero-line") || 0);
            var lineBaseOffset = lineIndex * 0.22;

            Array.prototype.forEach.call(
              line.querySelectorAll(".hero-letter"),
              function (letter) {
                var charIndex = Number(letter.getAttribute("data-char-index") || 0);
                var charOffset = charIndex * 0.018;
                var localProgress = clamp(
                  (progress - lineBaseOffset - charOffset) / 0.26,
                  0,
                  1
                );
                var translateY = (1 - localProgress) * 140;
                var rotate = (1 - localProgress) * 8;
                var scale = 0.92 + localProgress * 0.08;
                var blur = (1 - localProgress) * 8;
                var opacity = 0.04 + localProgress * 0.96;
                letter.style.transform =
                  "translate3d(0," +
                  translateY +
                  "%,0) rotate(" +
                  rotate +
                  "deg) scale(" +
                  scale.toFixed(3) +
                  ")";
                letter.style.opacity = opacity.toFixed(3);
                letter.style.filter = "blur(" + blur.toFixed(2) + "px)";
              }
            );
          }
        );
      });
    }

    function requestHeroRevealUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeroReveal);
    }

    updateHeroReveal();
    window.addEventListener("scroll", requestHeroRevealUpdate, { passive: true });
    window.addEventListener("resize", requestHeroRevealUpdate);
  }

  function startHeroRevealWhenReady() {
    syncHomeHeader();
    watchHomeHeader();
    syncHeroBelowVideo();
    syncMenuContactButton();
    window.setTimeout(initHeroScrollReveal, 0);
  }

  if (document.readyState === "complete") {
    startHeroRevealWhenReady();
  } else {
    window.addEventListener("load", startHeroRevealWhenReady, { once: true });
  }

  document.addEventListener(
    "click",
    function (event) {
      var anchor = event.target.closest("a");
      if (!isInternalLink(anchor)) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var destination = anchor.href;
      if (destination === window.location.href) return;

      event.preventDefault();
      sessionStorage.setItem(TRANSITION_KEY, "pending");
      body.classList.add("page-transition-running", "page-transition-exit");

      window.setTimeout(function () {
        window.location.href = destination;
      }, DURATION_MS);
    },
    true
  );
})();
