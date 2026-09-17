# TADA checklist

Drop this into your project and work down it before you deposit.
From the TADA-Wiki; see the wiki for the reasoning behind each item.

---

## T — Transferable

*Anyone can open the file, view and run the code without conversion or
alteration, on a different computer and operating system.*

- [ ] Every script has a standard extension for its language (`.R`, `.py`, `.cpp`, …)
- [ ] No code is distributed only inside a `.pdf` or `.docx`
- [ ] If the language has no standard format, the file opens in a plain text editor
- [ ] Data, code and all necessary materials are in a single project directory
- [ ] No `setwd()` (R) or `os.chdir()` (Python) anywhere
- [ ] No absolute paths (`/Users/…`, `C:/…`)
- [ ] Paths use `here()` / `pyprojroot`, or are relative to the project root
- [ ] The project opens via an `.Rproj` file, a virtual environment, or by opening the folder
- [ ] How to open the project is stated in the README
- [ ] Tested: copied to a different folder (ideally a different machine) and run

## A — Available

*The code is publicly archived with long-term access for any external user.*

- [ ] Deposited in an immutable, freely accessible repository (Zenodo, Figshare, Dataverse, …)
- [ ] The deposit has a globally unique persistent identifier (DOI or SWHID)
- [ ] The version-specific identifier matches the code that produced the published results
- [ ] The identifier is cited in the manuscript text **and** the reference list
- [ ] Code and data are in the same archived project where possible
- [ ] If developed on GitHub: a release was created and linked to Zenodo
- [ ] Nothing exists only as supplementary material attached to the article
- [ ] Any restricted data have a documented access route
- [ ] For double-blind review: an anonymised copy or anonymous link exists

## D — Documented

*Accurate, detailed metadata describing the code files and their usage.*

- [ ] A README (`.md` or `.txt`) is at the top level of the project
- [ ] Manuscript title and abstract
- [ ] Authors, with a contact email
- [ ] Relevant funders
- [ ] Software and version (e.g. R v4.3.3)
- [ ] Key packages with version numbers
- [ ] Full environment dump (`sessionInfo()` / `session_info`) included or referenced
- [ ] Where the data are, with a persistent identifier if archived separately
- [ ] What each file contains
- [ ] The order in which the code should be run
- [ ] Whether anything takes a long time or needs special hardware
- [ ] What data the code requires, and what it produces
- [ ] Every variable in every data file described, **with units**
- [ ] A licence is chosen, stated in the README, and attached (file or repository setting)
- [ ] Data and code licences are each appropriate to what they cover
- [ ] Any use of large language models in code generation is disclosed

## A — Annotated

*Comments within each code file, or code embedded in RMarkdown/Quarto with
descriptive text.*

- [ ] The script has a header at the top describing what it does and what it produces
- [ ] Code is broken into logical, labelled chunks
- [ ] Each chunk says what it does
- [ ] Each chunk says why it is needed
- [ ] Chunks producing results signpost the manuscript location (figure, table, section)
- [ ] Collapsible section markers used in long scripts (`#####` / `#----` in RStudio, `#%%` in VSCode/Spyder)
- [ ] Object names are interpretable by someone who did not write the code
- [ ] Unused `library()` / `import` calls removed
- [ ] Notebooks were restarted and run top to bottom before archiving
- [ ] For Quarto/RMarkdown: the **source** file is archived, not only rendered output

## Before you submit

- [ ] Seeds are set (`set.seed()` / `random.seed()`) before anything stochastic
- [ ] Saved outputs archived for anything slow or proprietary, and flagged in the metadata
- [ ] A colleague or co-author has run the whole thing from the archived files
- [ ] Spot-checked numbers from the results section match the output
