# Changelog
## Unreleased

## v1.2.1 [2021-01-26]
### Added
* Invalid wall detection (vanilla only, does not look for negative)

### Changed
* <15ms wall detection now look for wall inside wall case
* Reduced stacked note detection time from 20ms to 10ms

### Fixed
* Rounding for outside playable object detection

## v1.2.0 [2021-01-23]
### Added
* swing.js - swing detection, note angle, etc.
* Environment name on map info
* Colour dot per difficulty
* 2-center wall detection
* <15ms wall detection
* Zero width/duration wall detection
* Negative wall detection

### Changed
* Slightly updated layout and style
* Insignificant lighting event now check for only lit event
* Tolerance function is now called threshold function

### Fixed
* Object outside playable not giving correct output

## v1.1.4 [2021-01-21]
### Added
* Stacked note detection
* BPM changes counter
* Another tolerance function check

### Changed
* Updated `README.md`
* Updated tolerance value
* Updated beat calculation

## v1.1.3 [2021-01-20]
### Added
* Shrado angle detection
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