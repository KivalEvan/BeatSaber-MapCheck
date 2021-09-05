# Changelog

## v2.1.1 [05-08-2021]

### Changed

-   Bomb stack now checks by both NJS and time (<20ms)

## v2.1.0 [04-08-2021]

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
