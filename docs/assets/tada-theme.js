/* ---------------------------------------------------------------------------
   TADA-Wiki — light / dark theme toggle.

   The theme itself is set before first paint by a small inline script in
   assets/head.html (data-theme="light" or "dark" on <html>), so there is no
   flash of the wrong theme. This file adds the toggle button beside the book
   title in bs4_book's sidebar and:
     - switches the theme and remembers the choice in localStorage;
     - while the reader has made no choice, follows their system setting,
       including changes to it while the page is open.

   It also adds a colour-options button (four palettes and a colour-blind
   switch; see addPalettePicker below).

   Degrades safely: without JavaScript there are no buttons and the site stays
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

  /* --- Colour palette and colour-blind mode ------------------------------
     A second round button, before the sun/moon, opens a small panel with
     the four palettes (radio buttons) and a colour-blind switch. Choices are
     saved like the theme and applied before paint by assets/head.html. The
     panel is position: fixed and placed under the button on open, clamped
     to the viewport, so it works in both the desktop sidebar and the mobile
     header. */

  var PALETTES = [
    { id: "teal", name: "Teal" },
    { id: "indigo", name: "Indigo" },
    { id: "plum", name: "Plum" },
    { id: "ember", name: "Ember" }
  ];

  var PALETTE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/><circle cx="15.5" cy="7.5" r="1.2" fill="currentColor"/></svg>';

  function getPref(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function setPref(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* not remembered */ }
  }

  function applyPalette(id) {
    if (id === "teal") root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", id);
  }

  function applyCvd(on) {
    if (on) root.setAttribute("data-cvd", "on");
    else root.removeAttribute("data-cvd");
  }

  function addPalettePicker(themeButton) {
    if (!themeButton) return;
    var row = themeButton.parentNode;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "tada-theme-toggle tada-palette-btn";
    button.innerHTML = PALETTE_ICON;
    button.setAttribute("aria-label", "Colour options");
    button.setAttribute("title", "Colour options");
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "tada-palette-panel");

    var current = root.getAttribute("data-palette") || "teal";
    var panel = document.createElement("div");
    panel.id = "tada-palette-panel";
    panel.className = "tada-palette-panel";
    panel.hidden = true;
    panel.innerHTML =
      '<fieldset><legend>Colour theme</legend>' +
      PALETTES.map(function (p) {
        return '<label class="tada-palette-option">' +
          '<input type="radio" name="tada-palette" value="' + p.id + '"' +
          (p.id === current ? " checked" : "") + '>' +
          '<span class="tada-swatch tada-swatch--' + p.id + '" aria-hidden="true"></span>' +
          p.name + '</label>';
      }).join("") +
      '</fieldset>' +
      '<label class="tada-cvd-option">' +
      '<input type="checkbox" role="switch"' +
      (root.getAttribute("data-cvd") === "on" ? " checked" : "") + '>' +
      '<span>Colour-blind friendly' +
      '<small>Letter colours that stay distinct with the common types of colour blindness, and underlined links</small></span>' +
      '</label>';

    // The two buttons share a wrapper: stacked beside the title in the narrow
    // desktop sidebar, side by side in the mobile header (see style.css).
    var group = document.createElement("span");
    group.className = "tada-theme-buttons";
    row.insertBefore(group, themeButton);
    group.appendChild(button);
    group.appendChild(themeButton);
    document.body.appendChild(panel);

    // Beside the buttons when there is room (desktop), so the panel never
    // covers the sun/moon stacked under it; otherwise below, in the viewport.
    function place() {
      var r = button.getBoundingClientRect();
      var width = panel.offsetWidth;
      if (r.right + 8 + width <= window.innerWidth - 8 && window.innerWidth >= 992) {
        panel.style.top = r.top + "px";
        panel.style.left = (r.right + 8) + "px";
      } else {
        panel.style.top = (r.bottom + 8) + "px";
        panel.style.left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8) + "px";
      }
    }

    function open() {
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      place();
      var checked = panel.querySelector("input:checked") || panel.querySelector("input");
      checked.focus();
    }

    function close(returnFocus) {
      if (panel.hidden) return;
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (returnFocus) button.focus();
    }

    button.addEventListener("click", function () {
      if (panel.hidden) open(); else close(false);
    });

    panel.addEventListener("change", function (event) {
      var input = event.target;
      if (input.name === "tada-palette") {
        applyPalette(input.value);
        setPref("tada-palette", input.value === "teal" ? null : input.value);
      } else if (input.type === "checkbox") {
        applyCvd(input.checked);
        setPref("tada-cvd", input.checked ? "on" : null);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close(true);
    });

    document.addEventListener("click", function (event) {
      if (!panel.hidden && !panel.contains(event.target) && !button.contains(event.target)) close(false);
    });

    // Close rather than chase the button when focus leaves the panel.
    panel.addEventListener("focusout", function (event) {
      if (event.relatedTarget && !panel.contains(event.relatedTarget) && event.relatedTarget !== button) close(false);
    });

    window.addEventListener("resize", function () { if (!panel.hidden) place(); });
    window.addEventListener("scroll", function () { if (!panel.hidden) place(); }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = addToggle();
    addPalettePicker(button);

    if (media) {
      var follow = function (event) {
        if (!stored()) apply(event.matches ? "dark" : "light", button);
      };
      if (media.addEventListener) media.addEventListener("change", follow);
      else if (media.addListener) media.addListener(follow);
    }
  });
})();
