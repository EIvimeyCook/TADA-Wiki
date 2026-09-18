<p align="center">
  <img src="https://github.com/EIvimeyCook/TADA-Wiki/blob/main/assets/Wizard.png" width = "200"/>
</p>

<h1 align="center">TADA-Wiki</h1>

<p align="center">
  <em>Best practice for sharing analytical code: a bookdown wiki built on the
  TADA guidelines.</em>
</p>

<p align="center">
  <a href="LICENSE"><img alt="Code: MIT" src="https://img.shields.io/badge/code-MIT-blue.svg"></a>
  <a href="LICENSE-data.md"><img alt="Content: CC BY 4.0" src="https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey.svg"></a>
  <img alt="Built with bookdown" src="https://img.shields.io/badge/built%20with-bookdown-1f6feb.svg">
</p>

---

## Description

The TADA-Wiki is a practical reference on **how to share the analytical code
behind a paper** so that someone else can actually run it.

It is built around **TADA** (Transferable, Available, Documented, Annotated) and
sets those four guidelines alongside the practices that go with them: metadata,
licences, repository choice, the SORTEE guidelines for data and code quality
control, and code review.

The wiki exists because the gap between policy and practice is wide. In ecology
and evolutionary biology, 88% of journals had code-sharing policies by 2024, yet
only 5–35% of articles share code, and of the code that is shared, 74% of
archived R files in one large study failed to run without error. TADA sets a
**minimum standard** that closes most of that gap, and is achievable by
researchers at any level of coding experience.

Read it at: <https://eivimeycook.github.io/TADA-Wiki/>

## Contents

| Chapter | What it covers |
|---|---|
| Welcome | What the wiki is, TADA in four cards, where the guidance comes from |
| Start here | Pre-submission checklist, project layout, three common causes of failure |
| TADA at a glance | Why TADA exists, the evidence, how it maps onto FAIR |
| Transferable | File types, relative paths, `here` / `pyprojroot`, dependency managers, containers and workflow managers |
| Available | Persistent identifiers, why GitHub is not an archive, repository comparison, embargoes and anonymisation |
| Documented | The README field by field, a worked example, choosing a licence |
| Annotated | Chunk-level comments, signposting, collapsible sections, literate formats |
| Data & code sharing | Raw vs processed data, file formats, metadata, data licences, the six SORTEE stages |
| Code review | The four Rs, when review happens, running a code club, a reviewer's script |
| Further reading | Guides, tools, repositories, communities |
| Contribute | How to add a page, with a template |
| References | Everything cited |

## Templates

Four templates ship with the wiki, usable independently of it.

| File | Use |
|---|---|
| [`templates/README-template.md`](templates/README-template.md) | Project README covering every field required by TADA's *Documented* guideline and SORTEE Stages 1.5 and 3.5 |
| [`templates/tada-checklist.md`](templates/tada-checklist.md) | The full TADA checklist, to drop into a project |
| [`templates/code-review-checklist.md`](templates/code-review-checklist.md) | The four Rs, as a reviewer's worksheet |
| [`templates/page-template.Rmd`](templates/page-template.Rmd) | Skeleton for a new wiki chapter |

## Sources

The wiki is a synthesis of three papers:

- **Ivimey-Cook, E. R., Culina, A., Dimri, S., Grainger, M. J., Kar, F.,
  Lagisz, M., Moran, N. P., Nakagawa, S., Roche, D. G., Tattan, S.,
  Sánchez-Tójar, A., Windecker, S. M., & Pick, J. L.** *TADA! Simple guidelines
  to improve analytical code sharing for transparency and reproducibility.*
  Worked example: <https://github.com/EIvimeyCook/TADA>

- **Pick, J. L., et al.** (2026). *The SORTEE guidelines for data and code
  quality control in ecology and evolutionary biology.* Peer Community Journal
  6: e20. <https://doi.org/10.24072/pcjournal.687>

- **Ivimey-Cook, E. R., et al.** (2023). *Implementing code review in the
  scientific workflow: Insights from ecology and evolutionary biology.* Journal
  of Evolutionary Biology 36: 1347–1356. <https://doi.org/10.1111/jeb.14230>

Where the wiki extends beyond these papers, with worked examples, comparison
tables, checklists and the reviewer's script, that material is labelled **wiki
guidance** rather than presented as a finding of the papers. That separation is
the sourcing rule for contributors.

Every claim taken from the source papers, or from other published work, is
linked inline: click a citation to go to its DOI, or hover it to see the full
reference (title, journal, DOI) without leaving the page.

## Contributing

Corrections, additions and new chapters are all welcome — especially
language-specific guidance and adaptations to disciplines beyond ecology and
evolutionary biology.

- **Something wrong or out of date?** Open an
  [issue](https://github.com/EIvimeyCook/TADA-Wiki/issues).
- **Adding a page?** The *Contribute* chapter on the wiki has the full
  conventions — cross-references, callouts, tabs, the sourcing rule above, and
  how to register a new chapter.

## Citation

If this wiki is useful to you, please cite the underlying papers rather than
the wiki. Cite the TADA guidelines for the code-sharing advice, the SORTEE
guidelines for data and code quality control, and Ivimey-Cook et al. (2023) for
code review — full details in `CITATION.cff` and in the *References* chapter.

To cite the wiki itself, GitHub's *Cite this repository* button reads
`CITATION.cff`, or:

> Ivimey-Cook, E. R. (2026). *TADA-Wiki: Best practice for sharing analytical
> code.* <https://github.com/EIvimeyCook/TADA-Wiki>

## Contact

Edward R. Ivimey-Cook — e.ivimeycook@gmail.com
[![ORCID](https://img.shields.io/badge/ORCID-0000--0003--4910--0443-A6CE39.svg)](https://orcid.org/0000-0003-4910-0443)

## Licence

- **Code**, meaning the build script, `assets/style.css`, `assets/tada.js`,
  `assets/tada-cite.js`, `assets/tada-citations.js`, and the templates, under
  the [MIT License](LICENSE).
- **Content**, meaning the wiki text in the `.Rmd` chapters, under
  [CC BY 4.0](LICENSE-data.md).

The three PDFs in `docs/papers/` remain under their original licences. The SORTEE
guidelines paper is open access under CC BY 4.0.

## AI declaration

Claude (Anthropic) was used to draft and structure the wiki chapters from the
three source papers, and to write the CSS and JavaScript in `assets/`. All
content was subsequently checked against the source papers by the author.
