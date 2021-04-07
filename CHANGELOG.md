# Changelog

## v1.5.0 [2021-##-##]

### Added

-   File drag & drop function
-   Reset button
-   Map error output
-   Slow slider check
-   Time & difficulty specific vision block
-   No audio option (disable audio loading to speed up process)
-   Link to my website on watermark

### Changed

-   UI tweak
-   Reduced default Shrado angle max time to 150ms
-   Couple of code refactoring and cleanup

### Fixed

-   Potential issue with missing slider calculation on doubles

## v1.4.5 [2021-04-05]

### Fixed

-   Audio flag typo (should look for end object now)

## v1.4.4 [2021-04-03]

### Fixed

-   Swing diagonal not returning boolean

## v1.4.3 [2021-04-03]

### Changed

-   Restrictive difficulty label check

### Fixed

-   Fixed BTS light colour being the same

## v1.4.2 [2021-03-26]

### Changed

-   Updated color scheme
-   Link no longer have target

### Fixed

-   Unknown environment no longer crashes on load

## v1.4.1 [2021-03-11]

### Added

-   Total swing count

### Fixed

-   Missing subname display
-   Outside object not being detected

## v1.4.0 [2021-03-04]

### Added

-   Improper window snap check
-   Slider speed stats
-   NPS and SPS stats
-   Extensive light stats
-   Mapping utility link
-   Couple of error handling

### Changed

-   Updated JQuery 3.5.1 to JQuery 3.6.0 Slim
-   Stats UI reworked
-   CSS stuff
-   Code prettified

## v1.3.4 [2021-02-22]

### Added

-   Difficulty label length check
-   Stacked bomb <20ms check
-   Note placement table stats
-   Wiki and changelog link

### Changed

-   Moved around some stats info to make space for table
-   Renamed wall to obstacle to maintain consistency
-   Something, something about code readability

## v1.3.3 [2021-02-09]

### Added

-   Count chroma note and obstacle

### Changed

-   Properly count for chroma event
-   Staircase no longer count a double note

## v1.3.2 [2021-02-06]

### Changed

-   Overrides event colour with note colour if not specificied

### Fixed

-   DD check bomb didn't look after dot note
-   Event boost takes note colour instead of event colour

## v1.3.1 [2021-02-05]

### Added

-   Map link for URL or ID input by the cover image

### Changed

-   DD check now look after bomb (simple)
-   Changed default speed pause to 75ms
-   Ease colour gradient for accordion

### Fixed

-   Input error handling when map fails to load
-   Hitbox Staircase potentially consistently look for the end of note (except dot note, fuck dot note)
-   NaN value SPS for map without note

## v1.3.0 [2021-02-04]

### Added

-   global.js - for global variable and settings
-   URL support
-   Speed pause detection (EXPERIMENTAL)
-   Crouch wall detection
-   Web icon

### Changed

-   Code refactored
-   Supported .bsl file
-   Tweaked UI including QOL stuff

### Fixed

-   Colour dot not showing up when there is no custom data
-   Attempted to find outside playable object when there is no audio

## v1.2.3 [2021-01-29]

### Fixed

-   Invisible text for difficulty select

## v1.2.2 [2021-01-28]

### Added

-   Missing Chroma suggestion/requirement warning if contain Chroma event
-   Lane rotation event warning in non-360/90 mode

### Changed

-   Cleaned up stuff

### Fixed

-   Fixed lane rotation event showing chroma event instead

## v1.2.1 [2021-01-26]

### Added

-   Invalid wall detection (vanilla only, does not look for negative)

### Changed

-   <15ms wall detection now look for wall inside wall case
-   Reduced stacked note detection time from 20ms to 10ms

### Fixed

-   Rounding for outside playable object detection

## v1.2.0 [2021-01-23]

### Added

-   swing.js - swing detection, note angle, etc.
-   Environment name on map info
-   Colour dot per difficulty
-   2-center wall detection
-   <15ms wall detection
-   Zero width/duration wall detection
-   Negative wall detection

### Changed

-   Slightly updated layout and style
-   Insignificant lighting event now check for only lit event
-   Tolerance function is now called threshold function

### Fixed

-   Object outside playable not giving correct output

## v1.1.4 [2021-01-21]

### Added

-   Stacked note detection
-   BPM changes counter
-   Another tolerance function check

### Changed

-   Updated `README.md`
-   Updated tolerance value
-   Updated beat calculation

## v1.1.3 [2021-01-20]

### Added

-   Shrado angle detection
-   Console log for behind the scene

### Fixed

-   Properly check for swing tolerance

## v1.1.2 [2021-01-19]

### Fixed

-   Fixed DD issue

## v1.1.1 [2021-01-19]

### Added

-   Check for insignificant lighting event count

### Changed

-   `Set by HJD` now sets value to `HJD` instead of `HJD - 0.125`
-   Beat calculation calculate changes properly
-   DD check now look for weirdchamp sliders (not for full dot)
-   DD check flip previous cut direction for the next note if the current note is (entirely) dot note (check every dot note but assumes only flipping motion from previous known cut direction)
-   Map analysis output now bold text
-   Tolerance check function added for readability
-   Title updated
-   Moved watermark and version placement
-   Cleaned up `.css` file
-   Converted old UI stuff to JQuery

## v1.1.0 [2021-01-19]

### Added

-   Note row percentage
-   Extensive event stats
-   Check for object before start time and beyond end time
-   Beat time input and comparison

### Changed

-   Stats use `•` instead of `>`
-   Updated method to find DD
    -   Able to check through sliders (only standard pattern)
    -   Using angle difference instead of sudoku

### Fixed

-   DD check no longer assume if next up note after dot note is DD
