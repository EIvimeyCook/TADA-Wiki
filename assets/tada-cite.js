/* ---------------------------------------------------------------------------
   TADA-Wiki — citation hover cards.

   Turns `[text]{.tada-cite key="..."}` spans (rendered by Pandoc as
   `<span class="tada-cite" data-key="...">`) into a hover/focus popover
   showing the full reference, using the data in assets/tada-citations.js.

   The widget degrades safely: if the data file has not loaded, or a key is
   missing from it, the span stays as plain inline text and no content is
   lost. This file must be loaded after assets/tada-citations.js.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var SHOW_DELAY = 60;    // ms — avoids flicker on fast mouse passes
  var HIDE_DELAY = 250;   // ms — lets the pointer travel from trigger to card

  var openCard = null;    // the currently visible card element, if any
  var openTrigger = null; // the trigger that owns it
  var showTimer = null;
  var hideTimer = null;

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function buildEntryContent(entry) {
    var html = "";
    html += '<span class="tada-cite-authors">' + escapeHtml(entry.authors) + " (" + escapeHtml(entry.year) + ")</span>";
    if (entry.title) {
      html += '<span class="tada-cite-title">' + escapeHtml(entry.title) + "</span>";
    }
    if (entry.venue) {
      html += '<span class="tada-cite-venue">' + escapeHtml(entry.venue) + "</span>";
    }
    if (entry.note) {
      html += '<span class="tada-cite-note">' + escapeHtml(entry.note) + "</span>";
    }
    var link = entry.url || entry.pdf;
    if (link) {
      var label = entry.url ? "View source ↗" : "Manuscript PDF ↗";
      html += '<a class="tada-cite-link" href="' + escapeHtml(link) + '" target="_blank" rel="noopener">' + label + "</a>";
    }
    return html;
  }

  // A trigger's data-key can be a single key or a comma-separated list, for a
  // claim the source papers back with more than one citation at once (e.g.
  // the "5% to 35%" code-sharing figure, which cites six papers together).
  function buildCardContent(entries) {
    if (entries.length === 1) return buildEntryContent(entries[0]);
    return entries.map(function (entry, i) {
      var cls = "tada-cite-multi" + (i > 0 ? " tada-cite-multi-sep" : "");
      return '<span class="' + cls + '">' + buildEntryContent(entry) + "</span>";
    }).join("");
  }

  function positionCard(card, trigger) {
    // Reset any previous placement before measuring.
    card.classList.remove("is-above");
    card.style.left = "0px";
    card.style.top = "0px";

    var rect = trigger.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var margin = 8;

    var left = rect.left + window.scrollX;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - cardRect.width - margin;
    if (left > maxLeft) left = Math.max(window.scrollX + margin, maxLeft);

    var spaceBelow = window.innerHeight - rect.bottom;
    var above = spaceBelow < cardRect.height + margin && rect.top > cardRect.height + margin;

    var top;
    if (above) {
      top = rect.top + window.scrollY - cardRect.height - margin;
      card.classList.add("is-above");
    } else {
      top = rect.bottom + window.scrollY + margin;
    }

    card.style.left = left + "px";
    card.style.top = top + "px";
  }

  function closeCard() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (openCard) {
      openCard.classList.remove("is-visible");
      if (openTrigger) openTrigger.setAttribute("aria-expanded", "false");
    }
    openCard = null;
    openTrigger = null;
  }

  function cancelClose() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  function scheduleClose() {
    cancelClose();
    hideTimer = setTimeout(closeCard, HIDE_DELAY);
  }

  function openCardFor(trigger) {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    cancelClose();
    if (openTrigger === trigger) return; // already open

    var keys = (trigger.getAttribute("data-key") || "").split(",").map(function (k) { return k.trim(); }).filter(Boolean);
    var db = window.TADA_CITATIONS || {};
    var entries = keys.map(function (k) { return db[k]; }).filter(Boolean);
    // Degrade to plain text, no card, unless at least one key resolved.
    if (!entries.length) return;

    if (openCard) closeCard();

    var card = trigger._tadaCiteCard;
    if (!card) {
      card = document.createElement("span");
      card.className = "tada-cite-card";
      card.setAttribute("role", "note");
      card.id = "tada-cite-card-" + keys[0] + "-" + Math.random().toString(36).slice(2, 8);
      card.innerHTML = buildCardContent(entries);
      // Keep the card near its trigger in the DOM, but out of normal flow
      // (position: absolute), so it never disturbs surrounding text layout.
      trigger.parentNode.insertBefore(card, trigger.nextSibling);
      card.addEventListener("mouseenter", cancelClose);
      card.addEventListener("mouseleave", scheduleClose);
      trigger._tadaCiteCard = card;
      trigger.setAttribute("aria-describedby", card.id);
    }

    openCard = card;
    openTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    positionCard(card, trigger);
    card.classList.add("is-visible");
  }

  function scheduleOpen(trigger) {
    cancelClose();
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(function () { openCardFor(trigger); }, SHOW_DELAY);
  }

  function cancelOpen() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
  }

  function wireTrigger(trigger) {
    trigger.tabIndex = 0;
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("mouseenter", function () { scheduleOpen(trigger); });
    trigger.addEventListener("mouseleave", function () { cancelOpen(); scheduleClose(); });
    trigger.addEventListener("focus", function () { openCardFor(trigger); });
    trigger.addEventListener("blur", function () { scheduleClose(); });

    // Touch devices: a tap fires both a click and (usually) a focus event.
    // Toggling on click as well makes a second tap on the same citation
    // close it, rather than leaving it stuck open.
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      if (openTrigger === trigger) {
        closeCard();
      } else {
        openCardFor(trigger);
      }
    });
  }

  function init() {
    var triggers = document.querySelectorAll(".tada-cite[data-key]");
    triggers.forEach(wireTrigger);
    if (!triggers.length) return;

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && openTrigger) {
        var trigger = openTrigger;
        closeCard();
        trigger.focus();
      }
    });

    // Clicking anywhere outside an open card/trigger closes it.
    document.addEventListener("click", function (event) {
      if (!openCard) return;
      if (openTrigger.contains(event.target) || openCard.contains(event.target)) return;
      closeCard();
    });

    window.addEventListener("scroll", function () {
      if (openCard && openTrigger) positionCard(openCard, openTrigger);
    }, { passive: true });
    window.addEventListener("resize", function () {
      if (openCard && openTrigger) positionCard(openCard, openTrigger);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
