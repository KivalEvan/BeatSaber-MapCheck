# Changelog

## v2.3.1 [01-01-2022]

### Added

-   Event type list per environment
-   Basic Chroma check for unlit bomb check
-   Gaga environment support
-   JSDoc for development purpose

### Changed

-   Updated parsing
    -   Checks for type
    -   Handle missing properties
-   Updated Chroma properties
-   Updated hitbox check now uses new position/rotation system (except staircase)

### Fixed

-   Hitbox inline and reverse staircase calculation fix

## v2.3.0 [01-12-2021]

### Added

-   Standardised note and obstacle position and rotation with [BeatWalls system](https://camo.githubusercontent.com/295a4c05e569c99c6bf07cfabda8d80afdec1b7d/68747470733a2f2f692e696d6775722e636f6d2f557a37614944672e706e673d31303078313030) to allow modded content support
    -   This allows NE/ME map to use the error check functionality
    -   This also allows for more advanced checking in the future
    -   Updated check and threshold to better fit with the system
    -   Because of the change, some functionality may not work as intended (please report if you find them)
-   Unlit bomb check

### Changed

-   Switched from Webpack to Vite
-   Cleaned up and updated dependencies

## v2.2.5 [11-11-2021]

### Added

-   Download by hash from BeatSaver
-   LightID to Chroma Environment Enhancement info

### Fixed

-   Light value 8 no longer considered as invalid

## v2.2.4 [26-10-2021]

### Added

-   Spooky Environment support

### Changed

-   Note color check tweaked arrow color

## v2.2.3 [21-10-2021]

### Added

-   Note color check (EXPERIMENTAL)
    -   Similarity (including arrow)

### Fixed

-   Scary error for progression when audio is not loaded

## v2.2.2 [17-10-2021]

### Added

-   Distance input for shrado angle

### Changed

-   shrado angle now checks by distance between note

### Fixed

-   Potential fix for NJS HJD minimum

## v2.2.1 [10-10-2021]

### Changed

-   Hitbox path now checks for diagonal
-   Updated SPS requirement for 7:00 to 6:00

### Fixed

-   Hitbox path picking up bomb as note

## v2.2.0 [08-10-2021]

### Added

-   Skrillex & Billie Eilish environment support
-   Difficulty version for Information
-   Old value 4 event check for old map
-   Warning for long audio loading
-   Hitbox path check

### Changed

-   NJS HJD minimum limit reduced to 0.25 to accomodate v1.18.1 update
-   Mapping Extensions and Noodle Extensions now have basic check for valid (and negative) notes and obstacles
-   Plenty of code clean-up

### Fixed

-   NJS dependent check corrected formula (this affects inline, reverse stair, and stacked bomb)

### Deprecated

-   Map version older than v2.5.0 no longer gets support for event

## v2.1.1 [05-09-2021]

### Changed

-   Bomb stack now checks by both NJS and time (<20ms)

## v2.1.0 [04-09-2021]

### Added

-   Parity check (EXPERIMENTAL: please send feedback)
-   2-wide center wall recovery input

### Changed

-   Bomb stack now checks by NJS instead of time
-   Minor code clean up

### Fixed

-   Varying speed slider not picking up stack + slider
-   Mistaken 2-wide center wall for negative wall
-   BeatSaver link not having correct URL

## v2.0.3 [27-08-2021]

### Fixed

-   BeatSaver download not having correct request URL

## v2.0.2 [08-08-2021]

### Changed

-   Accordion button resized for mobile device

### Fixed

-   Invalid obstacle picking up 4-wide crouch wall

## v2.0.1 [06-08-2021]

### Added

-   Mobile friendly support

### Changed

-   Re-enabled BeatSaver Download
-   QoL update for VB tool

### Fixed

-   Invalid event picking up laser rotation of high value

## v2.0.0 : TypeScript Rewrite [05-08-2021]

### Added

-   Information Tab
    -   SongCore, Chroma & Noodle Extensions related stuff
-   Stats Tab
-   Settings Tab
    -   Saves to local storage
-   Theme
-   Audio player
-   Mode and difficulty ordering
-   Note Angle stats
-   Improved Note Placement stats
-   Partial Mapping Extensions and Noodle Extensions support

### Changed

-   Codebase rewritten
-   Improved tools
-   Updated SPS requirement
-   BeatSaver ID download temporarily disabled

### Fixed

-   Potential miscalculation on Chroma count
