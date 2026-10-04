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

   Both features degrade safely: without JavaScript the sidebar title is
   unchanged and every dog simply stays on its default (sad) image, so no
   content is ever lost.
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

  document.addEventListener("DOMContentLoaded", function () {
    addSidebarLogo();
    initChecklistDogs();
  });
})();
