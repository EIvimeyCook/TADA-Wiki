# Code review worksheet — the four Rs

From the TADA-Wiki, following Ivimey-Cook et al. (2023),
<https://doi.org/10.1111/jeb.14230>.

    Project:    ______________________________________
    Author(s):  ______________________________________
    Reviewer:   ______________________________________
    Date:       ______________________________________
    Goal of this session (circle one):
        general learning / readability      error-checking / reproducibility

---

## Before the session (reviewer)

- [ ] Downloaded the project into a **new, empty folder**
- [ ] Read the README first. Could you tell what to run, in what order, and
      what to install?
      Things you had to guess: ______________________________________
- [ ] Tried to run it in a **fresh session**. First blocking error:
      ______________________________________________________________

---

## R1 — Reported

*Does the code match the description of what is reported in the methods?*

- [ ] Every analysis described in the methods is present in the code
- [ ] Nothing substantive in the code is missing from the methods
- [ ] Model structures match (family, link, random effects, fixed effects)
- [ ] Filtering and exclusion criteria match what the paper reports
- [ ] Software and key packages, with versions, are stated
      (`citation()` in R; `setuptools` in Python)

Notes: ____________________________________________________________

## R2 — Run

*Can the code actually be executed?*

- [ ] Runs from a fresh download, in a fresh session, without manual fixes
- [ ] All required libraries/modules are installed and loaded within the code
- [ ] No missing code chunks
- [ ] File paths are relative and resolve
- [ ] Variable names in the code match the data files
- [ ] Filenames in the code match the archived files

Errors encountered: ________________________________________________

## R3 — Reliable

*Does the code produce the correct result, and not merely a result?*

This is the check that needs someone who knows the data. Read closely; do not
skim.

- [ ] Filtering steps select the rows you expect (check `nrow()` before/after)
- [ ] Joins and merges do not silently duplicate or drop rows
- [ ] The right columns are used — confirm each one with the author
- [ ] Units and transformations are consistent
- [ ] Model specification matches the intent, not just the syntax
- [ ] Seeds are set before stochastic steps
- [ ] Unit tests exist for anything non-obvious (`testthat` / `pytest`)

Notes: ____________________________________________________________

## R4 — Reproducible

*Do the outputs match the results in the paper?*

Take three numbers from the results section and find them in the output.

| Manuscript value | Reproduced value | Match? |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

Judging a match:

- **Conclusion and numbers** (Archmiller et al. 2020) — does the direction and
  significance hold, and do intervals match within one significant figure?
- **Percentage error** (Hardwicke et al. 2021) —
  `PE = (new − original) / original × 100`.
  Non-existent at 0; **minor** between 0 and 10; **major, and not
  reproducible**, at 10 or above.

- [ ] Any mismatch is explained (software version, stochasticity, figure
      post-processing) and documented in the metadata
- [ ] Saved outputs are archived for anything too slow to re-run

---

## Findings

**Must fix**

1. ________________________________________________________________
2. ________________________________________________________________

**Would be nice**

1. ________________________________________________________________
2. ________________________________________________________________

**Worked well.** Say so. The review covers the code, and noting what works is
part of it.

1. ________________________________________________________________

---

## Credit

How will the reviewer's contribution be recognised?

- [ ] MeRIT statement in the methods
      (e.g. "…Gaussian error distribution. Code was checked by E.I.C.")
- [ ] Acknowledgements
- [ ] Co-authorship, where the review fundamentally altered the project

The paper's principle is that incentives should be proportionate to the
reviewer's impact on the project.
