# Changelog
## Unreleased

## v1.1.3 [2021-01-20]
### Added
* Detect Shrado angle
* Console log for behind the scene

### Fixed
* Properly check for swing tolerance

## v1.1.2 [2021-01-19]
### Fixed
* Fixed DD issue

## v1.1.1 [2021-01-19]
### Added
* Check for insignificant lighting event count

### Changed
* `Set by HJD` now sets value to `HJD` instead of `HJD - 0.125`
* Beat calculation calculate changes properly
* DD check now look for weirdchamp sliders (not for full dot)
* DD check flip previous cut direction for the next note if the current note is (entirely) dot note (check every dot note but assumes only flipping motion from previous known cut direction)
* Map analysis output now bold text
* Tolerance check function added for readability
* Title updated
* Moved watermark and version placement
* Cleaned up `.css` file
* Converted old UI stuff to JQuery

## v1.1.0 [2021-01-19]
### Added
* Note row percentage
* Extensive event stats
* Check for object before start time and beyond end time
* Beat time input and comparison

### Changed
* Stats use `•` instead of `>`
* Updated method to find DD
  * Able to check through sliders (only standard pattern)
  * Using angle difference instead of sudoku

### Fixed
* DD check no longer assume if next up note after dot note is DD