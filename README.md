<h1 align="center">TADA-Wiki</h1>

<p align="center">
  <em>Best practice for sharing analytical code — a bookdown wiki built on the
  TADA guidelines.</em>
</p>

<p align="center">
  <a href="LICENSE"><img alt="Code: MIT" src="https://img.shields.io/badge/code-MIT-blue.svg"></a>
  <a href="LICENSE-CONTENT"><img alt="Content: CC BY 4.0" src="https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey.svg"></a>
  <img alt="Built with bookdown" src="https://img.shields.io/badge/built%20with-bookdown-1f6feb.svg">
  <img alt="R >= 4.0" src="https://img.shields.io/badge/R-%E2%89%A5%204.0-276DC3.svg">
</p>

---

## Description

The TADA-Wiki is a practical reference on **how to share the analytical code
behind a paper** so that someone else can actually run it.

It is built around **TADA** — Transferable, Available, Documented, Annotated —
and surrounds those four guidelines with the practices that go with them:
metadata, licences, repository choice, the SORTEE guidelines for data and code
quality control, and code review.

The wiki exists because the gap between policy and practice is wide. In ecology
and evolutionary biology, 88% of journals had code-sharing policies by 2024,
but only 5–33% of articles share code — and of the code that is shared, 74% of
archived R files in one large study failed to run without error. TADA sets a
**minimum standard** that closes most of that gap, and is achievable by
researchers at any level of coding experience.

## Contents

| Chapter | What it covers |
|---|---|
| Welcome | What the wiki is, TADA in four cards, where the guidance comes from |
| Start here | Pre-submission checklist, project layout, the three mistakes that break other people's runs |
| TADA at a glance | Why TADA exists, the evidence, how it maps onto FAIR |
| Transferable | File types, relative paths, `here` / `pyprojroot`, containers and workflow managers |
| Available | Persistent identifiers, why GitHub is not an archive, repository comparison, embargoes and anonymisation |
| Documented | The README field by field, a worked example, choosing a licence |
| Annotated | Chunk-level comments, signposting, collapsible sections, literate formats |
| Data & code sharing | Raw vs processed data, file formats, metadata, data licences, the six SORTEE stages |
| Code review | The four Rs, when review happens, running a code club, a reviewer's script |
| Further reading | Guides, tools, repositories, communities |
| Contribute | How to add a page, with a template |
| References | Everything cited |

## Installation

The wiki is built with [**bookdown**](https://bookdown.org/). You need R
(≥ 4.0) and Pandoc — RStudio ships with Pandoc, so if you build from RStudio
there is nothing else to install.

```r
install.packages(c("bookdown", "rmarkdown", "knitr", "downlit", "bslib"))
```

## Usage

Clone the repository and build:

```bash
git clone https://github.com/EIvimeyCook/TADA-Wiki.git
cd TADA-Wiki
Rscript render.R
```

Or, from R:

```r
bookdown::render_book("index.Rmd")
```

The rendered site is written to `docs/`, ready to serve from GitHub Pages
(*Settings → Pages → Deploy from a branch → `main` / `docs`*). Open
`docs/index.html` to preview locally.

If Pandoc is not on your `PATH`, `render.R` will look for the copy bundled with
RStudio and use that. To point it somewhere else:

```bash
RSTUDIO_PANDOC=/path/to/pandoc Rscript render.R
```

## Directory structure

| Path | Contents |
|---|---|
| `index.Rmd` | Welcome page and book-level YAML |
| `01-…` to `11-…` | One `.Rmd` file per chapter, numbered in reading order |
| `_bookdown.yml` | Chapter list, output directory, UI labels |
| `_output.yml` | Theme, CSS, HTML includes |
| `render.R` | Build script |
| `assets/` | `style.css`, `tada.js`, and the HTML head/foot includes |
| `templates/` | Copy-and-fill templates (see below) ||
| `docs/` | Rendered site — generated, not edited by hand |

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


## Bug reports and contributions

Corrections, additions and new chapters are all welcome — especially
language-specific guidance and adaptations to disciplines beyond ecology and
evolutionary biology.

- **Something wrong or out of date?** Open an
  [issue](https://github.com/EIvimeyCook/TADA-Wiki/issues).
- **Adding a page?** Copy `templates/page-template.Rmd`, register it in
  `_bookdown.yml`, build, and open a pull request. The *Contribute* chapter has
  the full conventions — cross-references, callouts, tabs, and the sourcing
  rule.

Before opening a PR, check that `Rscript render.R` completes without errors and
that new sources are added to `11-references.Rmd`.

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

## License

- **Code** —  under the [MIT License](LICENSE).
- **Content** — under [CC BY 4.0](LICENSE-CONTENT).

## AI Declaration

Claude (Anthropic) was used to draft and structure the wiki chapters from the
three source papers, and to write the CSS and JavaScript in `assets/`. All
content was reviewed against the source papers by the author.
