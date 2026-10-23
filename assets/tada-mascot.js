/* ---------------------------------------------------------------------------
   TADA-Wiki — mascot behaviour.

   Two independent, safely-degrading pieces:
   1. Drops the wizard next to the book title in bs4_book's sidebar, which is
      shared markup repeated on every page, so the mascot appears site-wide
      rather than only on the homepage hero.
   2. On every interactive checklist (any heading whose section contains a
      .tada-dog-float), crossfades the sad dog into the happy dog once every
      checkbox in that section is ticked, and back again as soon as one is
      cleared. This is generic across the whole site: it looks for each
      .tada-dog-float, walks up to its enclosing bookdown section, and wires
      up whatever checkboxes live in that section — no per-page IDs needed.

   3. On the front page, adds the sparks to the wizard's "TADA!" reveal and
      lets a click replay it.

   All degrade safely: without JavaScript the sidebar title is unchanged,
   every dog simply stays on its default (sad) image, and the wizard reveal
   still plays, just without sparks, so no content is ever lost.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  function addSidebarLogo() {
    var heading = document.querySelector("header.sidebar h1");
    if (!heading || heading.querySelector(".tada-logo")) return;
    var img = document.createElement("img");
    img.src = "assets/figures/wizard-tada.png";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.className = "tada-logo";
    heading.insertBefore(img, heading.firstChild);

    // bs4_book writes "Title: <small>subtitle</small>". With the logo, the
    // title and subtitle sit stacked beside it (see .tada-has-logo in
    // style.css), so the joining colon is dropped.
    Array.prototype.forEach.call(heading.childNodes, function (node) {
      if (node.nodeType === 3 && node.textContent.trim() === ":") node.textContent = "";
    });
    heading.classList.add("tada-has-logo");
  }

  function initChecklistDogs() {
    var floats = document.querySelectorAll(".tada-dog-float");

    floats.forEach(function (float) {
      var section = float.closest("div.section");
      if (!section) return;
      var checkboxes = section.querySelectorAll('input[type="checkbox"]');
      if (!checkboxes.length) return;

      function update() {
        var allChecked = Array.prototype.every.call(checkboxes, function (cb) {
          return cb.checked;
        });
        float.classList.toggle("is-happy", allChecked);
      }

      checkboxes.forEach(function (cb) {
        cb.addEventListener("change", update);
      });

      update();
    });
  }

  // Front-page wizard: the "TADA!" reveal itself is pure CSS (see the hero
  // section of style.css). This adds the sparks that burst from the wand,
  // and replays the whole thing when the wizard is clicked. The sparks are
  // hidden by CSS when the reader prefers reduced motion.
  var SPARKS = [
    { dx: 46, dy: -38, s: 14, delay: 0.9 },
    { dx: 58, dy: 6, s: 10, delay: 0.95 },
    { dx: 30, dy: 44, s: 9, delay: 1.0 },
    { dx: -8, dy: -56, s: 11, delay: 0.92 },
    { dx: -40, dy: -24, s: 8, delay: 1.02 },
    { dx: 18, dy: -70, s: 9, delay: 1.05 },
    { dx: 66, dy: -60, s: 7, delay: 1.08 }
  ];

  function initWizardReveal() {
    var frame = document.querySelector(".tada-hero-figure .inline-figure");
    if (!frame) return;

    SPARKS.forEach(function (sp) {
      var el = document.createElement("span");
      el.className = "tada-spark";
      el.setAttribute("aria-hidden", "true");
      el.style.setProperty("--dx", sp.dx + "px");
      el.style.setProperty("--dy", sp.dy + "px");
      el.style.setProperty("--s", sp.s + "px");
      el.style.setProperty("--delay", sp.delay + "s");
      frame.appendChild(el);
    });

    if (!document.getAnimations) return;
    frame.addEventListener("click", function () {
      // The wave and the word keep their end state, so they are still listed
      // and can be rewound. Finished sparks are not, so restart those by
      // dropping and restoring their animation.
      document.getAnimations().forEach(function (anim) {
        var target = anim.effect && anim.effect.target;
        if (target && (target === frame || frame.contains(target))) {
          anim.cancel();
          anim.play();
        }
      });
      frame.querySelectorAll(".tada-spark").forEach(function (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    addSidebarLogo();
    initChecklistDogs();
    initWizardReveal();
  });
})();
