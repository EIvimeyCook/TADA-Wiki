#!/usr/bin/env Rscript
#
# Build the TADA-Wiki.
#
#   Rscript render.R
#
# Output goes to docs/ (set in _bookdown.yml), ready to serve from GitHub Pages.
# Pandoc is required. If it is not on the PATH, this script looks for the copy
# bundled with RStudio. Override with:
#
#   RSTUDIO_PANDOC=/path/to/pandoc Rscript render.R

# --- Pandoc ------------------------------------------------------------------

find_pandoc <- function() {
  if (rmarkdown::pandoc_available()) return(invisible(NULL))

  candidates <- c(
    Sys.getenv("RSTUDIO_PANDOC"),
    "/Applications/RStudio.app/Contents/Resources/app/quarto/bin/tools/aarch64",
    "/Applications/RStudio.app/Contents/Resources/app/quarto/bin/tools/x86_64",
    "/Applications/RStudio.app/Contents/Resources/app/bin/quarto/bin/tools",
    "/usr/lib/rstudio/bin/quarto/bin/tools",
    "/usr/lib/rstudio-server/bin/quarto/bin/tools",
    "C:/Program Files/RStudio/resources/app/bin/quarto/bin/tools"
  )

  for (dir in candidates[nzchar(candidates)]) {
    if (file.exists(file.path(dir, "pandoc")) ||
        file.exists(file.path(dir, "pandoc.exe"))) {
      Sys.setenv(RSTUDIO_PANDOC = dir)
      rmarkdown::find_pandoc(dir = dir, cache = FALSE)
      if (rmarkdown::pandoc_available()) {
        message("Using Pandoc from: ", dir)
        return(invisible(NULL))
      }
    }
  }

  stop(
    "Pandoc not found. Install it (https://pandoc.org/installing.html), ",
    "build from RStudio, or set RSTUDIO_PANDOC to the directory containing ",
    "the pandoc binary.",
    call. = FALSE
  )
}

# --- Dependencies ------------------------------------------------------------

required <- c("bookdown", "rmarkdown", "knitr", "downlit", "bslib")
missing  <- required[!vapply(required, requireNamespace, logical(1),
                             quietly = TRUE)]

if (length(missing)) {
  stop(
    "Missing package(s): ", paste(missing, collapse = ", "), "\n",
    'Install with: install.packages(c("',
    paste(missing, collapse = '", "'), '"))',
    call. = FALSE
  )
}

# --- Build -------------------------------------------------------------------

find_pandoc()

# render_book() needs to run from the book root, wherever the script was called.
root <- tryCatch(
  dirname(normalizePath(sub("^--file=", "", grep("^--file=", commandArgs(),
                                                 value = TRUE)[1]))),
  error = function(e) getwd()
)
if (!is.na(root) && dir.exists(root)) setwd(root)

message("Building the TADA-Wiki...")

bookdown::render_book(
  input  = "index.Rmd",
  output_format = "bookdown::bs4_book",
  quiet  = FALSE
)

# render_book leaves this behind if a build fails partway through.
if (file.exists("_main.Rmd")) file.remove("_main.Rmd")

# GitHub Pages runs Jekyll by default, which ignores directories beginning with
# an underscore (bookdown writes libs/ but rmarkdown can emit _files/ too). The
# build does not create this, so a clean docs/ would silently break Pages.
if (!file.exists(file.path("docs", ".nojekyll"))) {
  file.create(file.path("docs", ".nojekyll"))
}

message("\nDone. Open docs/index.html to preview.")
