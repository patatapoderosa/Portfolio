(function () {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function splitLine(line) {
    var text = (line.textContent || "").replace(/\s+/g, " ").trim();
    line.setAttribute("aria-label", text);
    line.classList.add("scroll-line");
    line.textContent = "";

    Array.prototype.forEach.call(text, function (character, index) {
      var span = document.createElement("span");
      span.className = character === " " ? "scroll-letter scroll-space" : "scroll-letter";
      span.setAttribute("data-char-index", String(index));
      span.textContent = character === " " ? "\u00A0" : character;
      line.appendChild(span);
    });
  }

  function initHeroAnimation() {
    var hero = document.querySelector("[data-scroll-letters]");
    if (!hero) return;

    Array.prototype.forEach.call(
      hero.querySelectorAll("[data-scroll-line]"),
      splitLine
    );

    function update() {
      var rect = hero.getBoundingClientRect();
      var travel = window.innerHeight * 0.9;
      var progress = clamp((window.innerHeight * 0.86 - rect.top) / travel, 0, 1);

      Array.prototype.forEach.call(
        hero.querySelectorAll("[data-scroll-line]"),
        function (line) {
          var lineIndex = Number(line.getAttribute("data-scroll-line") || 0);
          var lineOffset = lineIndex * 0.14;

          Array.prototype.forEach.call(
            line.querySelectorAll(".scroll-letter"),
            function (letter) {
              var charIndex = Number(letter.getAttribute("data-char-index") || 0);
              var charOffset = charIndex * 0.022;
              var local = clamp((progress - lineOffset - charOffset) / 0.3, 0, 1);
              var translateY = (1 - local) * 140;
              var rotate = (1 - local) * 8;
              var scale = 0.92 + local * 0.08;
              var blur = (1 - local) * 10;
              var opacity = 0.04 + local * 0.96;

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
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroAnimation, { once: true });
  } else {
    initHeroAnimation();
  }
})();
