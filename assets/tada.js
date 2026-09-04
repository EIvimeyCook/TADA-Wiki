/* ---------------------------------------------------------------------------
   TADA-Wiki — turn Pandoc `.tabset` sections into a tab widget.

   bs4_book keeps the `.tabset` class on the parent section but does not build
   any tab UI of its own, so we do it here. Each direct child section becomes a
   pane; its heading becomes the tab label and is then hidden.

   The widget degrades safely: with JavaScript off every pane simply stays
   visible with its heading, so no content is ever lost.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var HEADINGS = "h1, h2, h3, h4, h5, h6";

  function labelFor(heading, fallback) {
    if (!heading) return fallback;
    var clone = heading.cloneNode(true);
    // Drop bookdown's section number and the hover anchor link.
    clone.querySelectorAll(".header-section-number, .anchor, a.anchor-section")
      .forEach(function (el) { el.remove(); });
    var text = clone.textContent.replace(/\s+/g, " ").trim();
    return text || fallback;
  }

  function isSection(el) {
    return el.matches("div.section, section") && !el.classList.contains("tada-tablist");
  }

  function buildTabset(tabset, index) {
    var panes = Array.prototype.filter.call(tabset.children, isSection);
    if (panes.length < 2) return;

    var list = document.createElement("div");
    list.className = "tada-tablist";
    list.setAttribute("role", "tablist");

    var buttons = [];

    panes.forEach(function (pane, i) {
      var heading = pane.querySelector(HEADINGS);
      var label = labelFor(heading, "Tab " + (i + 1));
      var paneId = pane.id || "tada-pane-" + index + "-" + i;
      pane.id = paneId;
      pane.classList.add("tada-pane");

      var button = document.createElement("button");
      button.type = "button";
      button.className = "tada-tab";
      button.textContent = label;
      button.id = paneId + "-tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", paneId);

      // The pane's own heading is hidden by CSS, so name the panel from the tab.
      pane.setAttribute("role", "tabpanel");
      pane.setAttribute("aria-labelledby", button.id);
      pane.tabIndex = 0;

      button.addEventListener("click", function () { activate(i); });
      button.addEventListener("keydown", function (event) {
        var next;
        if (event.key === "ArrowRight") next = (i + 1) % panes.length;
        else if (event.key === "ArrowLeft") next = (i - 1 + panes.length) % panes.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = panes.length - 1;
        else return;
        event.preventDefault();
        activate(next);
        buttons[next].focus();
      });

      buttons.push(button);
      list.appendChild(button);
    });

    function activate(active) {
      panes.forEach(function (pane, i) {
        var on = i === active;
        pane.classList.toggle("is-active", on);
        buttons[i].classList.toggle("is-active", on);
        buttons[i].setAttribute("aria-selected", on ? "true" : "false");
        buttons[i].tabIndex = on ? 0 : -1;
      });
    }

    // A link or search hit pointing at a pane must open that pane, not tab one.
    function indexForHash() {
      var hash = window.location.hash.replace(/^#/, "");
      if (!hash) return -1;
      for (var i = 0; i < panes.length; i++) {
        if (panes[i].id === hash || panes[i].querySelector("#" + CSS.escape(hash))) return i;
      }
      return -1;
    }

    tabset.insertBefore(list, panes[0]);

    var initial = indexForHash();
    activate(initial === -1 ? 0 : initial);

    window.addEventListener("hashchange", function () {
      var target = indexForHash();
      if (target !== -1) activate(target);
    });

    // The hidden pane headings would otherwise clutter the "On this page" nav.
    panes.forEach(function (pane) {
      document
        .querySelectorAll('#main-nav a[href="#' + pane.id + '"], nav a[href="#' + pane.id + '"]')
        .forEach(function (link) {
          var item = link.closest("li");
          (item || link).remove();
        });
    });
  }

  function init() {
    document.querySelectorAll(".tabset").forEach(buildTabset);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
