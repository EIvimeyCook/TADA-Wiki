/* ---------------------------------------------------------------------------
   TADA-Wiki — light / dark theme toggle.

   The theme itself is set before first paint by a small inline script in
   assets/head.html (data-theme="light" or "dark" on <html>), so there is no
   flash of the wrong theme. This file adds the toggle button beside the book
   title in bs4_book's sidebar and:
     - switches the theme and remembers the choice in localStorage;
     - while the reader has made no choice, follows their system setting,
       including changes to it while the page is open.

   Degrades safely: without JavaScript there is no button and the site stays
   in the light theme. If localStorage is blocked, the toggle still works for
   the current page; the choice just is not remembered.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var KEY = "tada-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  var MOON = '<svg class="tada-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg class="tada-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function stored() {
    try {
      var t = localStorage.getItem(KEY);
      return t === "light" || t === "dark" ? t : null;
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* not remembered */ }
  }

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function label(button) {
    var dark = current() === "dark";
    var text = dark ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", text);
    button.setAttribute("title", text);
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function apply(theme, button) {
    root.setAttribute("data-theme", theme);
    if (button) label(button);
  }

  function addToggle() {
    var row = document.querySelector("header.sidebar .d-flex");
    if (!row || row.querySelector(".tada-theme-toggle")) return null;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "tada-theme-toggle";
    button.innerHTML = MOON + SUN;
    label(button);

    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next, button);
      save(next);
    });

    // Before the mobile menu button if there is one, so the two sit together.
    var menu = row.querySelector("button");
    row.insertBefore(button, menu || null);
    return button;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = addToggle();

    if (media) {
      var follow = function (event) {
        if (!stored()) apply(event.matches ? "dark" : "light", button);
      };
      if (media.addEventListener) media.addEventListener("change", follow);
      else if (media.addListener) media.addListener(follow);
    }
  });
})();
