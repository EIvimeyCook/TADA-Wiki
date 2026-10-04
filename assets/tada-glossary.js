/* ---------------------------------------------------------------------------
   TADA-Wiki — "Terms on this page".

   Reads the glossary page (glossary.html), finds which glossary terms appear
   in the current chapter, and lists them in the right-hand sidebar below
   "On this page". The list is collapsed by default to a single line showing
   how many terms there are; each term then expands to show its definition and
   links to its full glossary entry.

   Which words count as a match is set in 11-glossary.Rmd, on each term's span:
     [DOI]{#gloss-doi data-match="DOI"}
   Alternatives are separated by "|"; a trailing plural "s" is allowed.
   Phrases containing a capital letter match case-sensitively (DOI, GitHub);
   all-lowercase phrases match in any case. Terms with no data-match are never
   listed here, but stay on the glossary page.

   Fails silently: if glossary.html cannot be fetched (e.g. opening the site
   from file://), the sidebar is left as it was.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  var GLOSSARY_URL = "glossary.html";

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildRegex(phrase) {
    var caseSensitive = /[A-Z]/.test(phrase);
    var body = escapeRegex(phrase.trim()).replace(/\s+/g, "\\s+");
    // Word boundaries that also treat "-" and "." as part of a word, so that
    // "FAIR" does not match inside "FAIR4RS" and "seed" still matches in
    // "set.seed".
    return new RegExp("(^|[^A-Za-z0-9_-])" + body + "s?(?![A-Za-z0-9_])", caseSensitive ? "" : "i");
  }

  function pageText(main) {
    var clone = main.cloneNode(true);
    clone.querySelectorAll("pre, script, style, .tada-glossary").forEach(function (el) { el.remove(); });
    return clone.textContent || "";
  }

  function parseGlossary(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var terms = [];
    doc.querySelectorAll(".tada-glossary dt").forEach(function (dt) {
      var span = dt.querySelector("span[id][data-match]");
      var dd = dt.nextElementSibling;
      if (!span || !dd || dd.tagName !== "DD") return;
      // Citation spans would need the hover-card script; show them as text.
      dd.querySelectorAll(".tada-cite").forEach(function (c) {
        c.replaceWith(document.createTextNode(c.textContent));
      });
      terms.push({
        id: span.id,
        name: span.textContent.trim(),
        patterns: span.getAttribute("data-match").split("|").filter(Boolean).map(buildRegex),
        definition: dd.innerHTML.trim()
      });
    });
    return terms;
  }

  function render(found, toc) {
    var box = document.createElement("details");
    box.className = "tada-terms";

    var head = document.createElement("summary");
    head.className = "tada-terms-head";
    head.textContent = "Terms on this page (" + found.length + ")";
    box.appendChild(head);

    var ul = document.createElement("ul");
    found.forEach(function (t) {
      var li = document.createElement("li");
      var det = document.createElement("details");
      var sum = document.createElement("summary");
      sum.textContent = t.name;
      det.appendChild(sum);

      var def = document.createElement("div");
      def.className = "tada-term-def";
      def.innerHTML = t.definition;
      var more = document.createElement("a");
      more.className = "tada-term-more";
      more.href = GLOSSARY_URL + "#" + t.id;
      more.textContent = "Full glossary entry →";
      def.appendChild(more);

      det.appendChild(def);
      li.appendChild(det);
      ul.appendChild(li);
    });
    box.appendChild(ul);

    var all = document.createElement("a");
    all.className = "tada-terms-all";
    all.href = GLOSSARY_URL;
    all.textContent = "See the full glossary";
    box.appendChild(all);

    var extra = toc.querySelector(".book-extra");
    if (extra) toc.insertBefore(box, extra); else toc.appendChild(box);
  }

  function init() {
    var main = document.getElementById("content");
    var toc = document.getElementById("toc");
    if (!main || !toc || !window.fetch || !window.DOMParser) return;
    // Not on the glossary page itself.
    if (main.querySelector(".tada-glossary")) return;

    fetch(GLOSSARY_URL)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var text = pageText(main);
        var found = parseGlossary(html).filter(function (t) {
          return t.patterns.some(function (re) { return re.test(text); });
        });
        found.sort(function (a, b) { return a.name.localeCompare(b.name); });
        if (found.length) render(found, toc);
      })
      .catch(function () { /* leave the sidebar as it is */ });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
