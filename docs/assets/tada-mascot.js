/* ---------------------------------------------------------------------------
   TADA-Wiki — mascot behaviour.

   Two independent, safely-degrading pieces:
   1. Drops the wizard next to the book title in bs4_book's sidebar, which is
      shared markup repeated on every page, so the mascot appears site-wide
      rather than only on the homepage hero.
   2. On the Quickstart pre-submission checklist, swaps the sad dog for the
      happy dog as soon as any checkbox in the checklist is ticked, and back
      again if every box is cleared.

   Both features degrade safely: without JavaScript the sidebar title is
   unchanged and the dog simply stays on its default image, so no content is
   ever lost.
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
  }

  function initChecklistDog() {
    var section = document.getElementById("quickstart-checklist");
    if (!section) return;
    var img = document.getElementById("tada-checklist-dog-img");
    if (!img) return;
    var checkboxes = section.querySelectorAll('input[type="checkbox"]');
    if (!checkboxes.length) return;

    function update() {
      var anyChecked = Array.prototype.some.call(checkboxes, function (cb) {
        return cb.checked;
      });
      if (anyChecked) {
        img.src = "assets/figures/dog-happy.png";
        img.alt = "A happy cartoon dog wearing a wizard hat";
      } else {
        img.src = "assets/figures/dog-sad.png";
        img.alt = "A sad cartoon dog wearing a wizard hat";
      }
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener("change", update);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    addSidebarLogo();
    initChecklistDog();
  });
})();
