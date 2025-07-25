# Changelog

## 2.7.0 [2025-07-23]

Major changes here should result in better QoL, faster loading, and less memory
usage.

### Added

-  Add environment & color scheme
   -  Collider
   -  Britney Spears
   -  Monstercat 2.0
   -  Metallica
-  Checks preset
-  Bookmark export
-  Nested folder loading
-  Several new checks
   -  Angle offset
   -  Excessive double
   -  Hammer hit
   -  Handclap pattern
   -  Outro
   -  Parallel notes
   -  Rankable obstacle
   -  Variable NJS

### Changed

-  Beatmap core complete overhaul
   -  No longer converts beatmap for compatibility
-  UI revamped
   -  Stats no longer generate all difficulty at once, uses currently selected
   -  Overall should result in less memory usage
-  Internal changes, now includes integration & regression testing

### Fixed

-  Plenty of fixes from regression testing
-  Mappers and lighters information does not reset upon reset
-  BPM change shows even if the minimum and maximum are equal
-  Stacked bomb, hitbox inline, reverse staircase and short obstacle not accounting for BPM change
-  Fallback NJS not being used

### Removed

-  Monochrome theme (bugged)

## 2.6.1 [2024-03-25]

### Fixed

-  Potential error when dealing with beatmap of different version

## 2.6.0 [2024-03-07]

### Added

-  v4 beatmap support
-  Lattice and Daft Punk environment & color scheme
-  Audio duration inferring from BPMInfo.dat and Audio Data

### Changed

-  Now uses v4 beatmap as internal
-  Improved loading bar
-  Updated many checks
-  Rework asynchronous process
   -  Should be noticeably faster
-  Minor UI tweaks
-  Various tweaks and fixes

### Fixed

-  One saber check being missing
-  Data check not working properly
-  Data check settings not being applied

### Deprecated

-  Beatmap v3.x.x is now unsupported
   -  Beatmap v3 can still be used by map check, but will not gain any feature
      updated around it.

### Removed

-  Loading bar smoothing

## 2.5.15 [2023-10-31]

### Added

-  The Rolling Stones environment & color scheme

## 2.5.14 [2023-10-12]

### Added

-  Updated to beatmap v3.3.0
   -  FX Event Box Group
   -  FX Events Collection
-  Linkin Park 2.0 environment & color scheme
-  [New SongCore features](https://github.com/Kylemc1413/SongCore/pull/122)
   (tags, custom characteristic label, etc.)
-  One Saber check
-  Official color scheme and environment per difficulty

### Changed

-  Improved loading logic
   -  Can now load beatmap v1
-  Loading beatmap can now default missing attributes as given by 1.32 editor
   update
-  The Weeknd and Panic 2.0 color scheme now shows white color value
-  New unknown environment now display environment string itself
-  Different message for light event check in v3 environment

### Fixed

-  Unknown characteristic no longer leave blank in stats page
-  Potential SPS progression check fix

## 2.5.13 [2023-06-02]

### Fixed

-  EBPM logic ordering error
-  EBPM threshold should have float error tolerance

## 2.5.12 [2023-06-01]

### Added

-  Queen environment and color scheme

### Fixed

-  Properly calculate effective BPM

## 2.5.11 [2023-04-15]

### Added

-  Panic 2.0 environment and color scheme

### Changed

-  Arc no longer count towards interactive time
   -  While arc can affect scoring, visibility and haptic can be disabled and
      mostly served as cosmetic
-  Bomb should now count towards interactive time (idk why this was filtered in
   the first place)

### Fixed

-  Custom white color should no longer set if boost or non-boost does not exist

### Removed

-  Headless arc check (a valid use since 1.29.0)

## 2.5.10 [2023-03-28]

### Added

-  Dragons 2.0 environment and color scheme
-  Custom white light support

### Changed

-  Custom color no longer shows non-custom color in information

## 2.5.9 [2023-01-10]

### Added

-  Rock Mixtape environment and color scheme

### Fixed

-  Map with event for keyword could not be loaded

## 2.5.8 [2022-11-20]

### Fixed

-  Progression filtering error
-  Potential index filter instantiating error fix
-  Index filter validation error for random type and limit affects type

## 2.5.7 [2022-11-16]

### Added

-  Event box check
-  Tools output symbol
   -  🚧 Ranking: for rankability reason.
   -  ❌ Error: should be fixed unless you know what you are doing.
   -  ❗ Warning: not necessarily needed to be fixed but worth considering.
   -  ⚠️ Info: no action necessary and worth noting.

### Fixed

-  Progression calculation error
-  Event box causes error for unused ID

## 2.5.6 [2022-11-09]

### Added

-  Beatmap 3.2.0 support
-  The Weeknd environment & color scheme

### Fixed

-  Point definitions not being shown

## 2.5.5 [2022-10-29]

### Added

-  Play time information
-  BPM event/change header

### Changed

-  Updated packages and Beat Saber core script

### Fixed

-  Obstacle incorrectly counting interactive in specific case
-  Version improperly set to `3.0.0` for `3.1.0` map

## 2.5.4 [2022-10-07]

### Added

-  Lizzo environment & color scheme support
-  Progression check provides more information
   -  Per difficulty select

### Changed

-  Updated Beat Saber core script
-  Adjusted NJS check
-  Hitbox Path now checks for bomb

### Fixed

-  NJS fallback value not being used

## 2.5.3 [2022-08-25]

### Added

-  CORS proxy for URL download (thanks, BSMG)

## 2.5.2 [2022-08-16]

### Changed

-  Improved UI look
-  v2 Waypoints is now optional

### Fixed

-  Boost event count crash for v3 environment map

## 2.5.1 [2022-08-09]

### Added

-  Chroma geometry support
-  Bookmark color
-  Adjustable information table height
-  v3 BPM change support

### Changed

-  Updated to latest dependencies

### Fixed

-  EBPM points to current note instead of next note
-  Color boost not counted in stats
-  Typo

## 2.5.0 [2022-06-19]

### Added

-  v3 beatmap support
-  v2 to v3 beatmap internal conversion
   -  This may be inaccurate for modded v2 map as it internally convert modded to
      v3
-  Weave, Pyro and EDM environment
-  Basic slider and burst slider check
-  More tool check including general
-  Tool check hover tooltip
-  More stats for v3 stuff
-  Dynamic event name based on environment
-  Beat numbering and rounding settings
   -  Shows alternative on hover
-  Standard style format (development)

### Changed

-  Yet another major structure changes
-  Better internal user interface work
-  All check can now be toggled
-  v2 event floatValue and v2 obstacle lineLayer & height is now optional
-  Package dependencies updated to latest
-  Changelog date format

### Deprecated

-  Beatmap v2.x.x is now unsupported
   -  Beatmap v2 can still be used by map check, but will not gain any feature
      updated around it.

### Removed

-  Old event value check
-  Event peak and per second check
-  Negative obstacle check (invalid check already points it)

## 2.4.0 [2022-03-02]

### Changed

-  Major structure change (for better development)
-  Download from URL changes to download from ID if it detects valid BeatSaver
   map link
-  Time spent now shows HH:MM:SS instead of HH:MM
-  Actually added Gaga color scheme
-  Restructured custom mod stuff

### Removed

-  CORS proxy (I don't think this is even needed anymore)

## 2.3.1 [2022-01-04]

### Added

-  Event type list per environment
-  Basic Chroma check for unlit bomb check
-  Gaga environment support
-  JSDoc for development purpose

### Changed

-  Updated parsing
   -  Checks for type
   -  Handle missing properties
-  Updated Chroma properties
-  Updated hitbox check now uses new position/rotation system (except staircase)

### Fixed

-  Hitbox inline and reverse staircase calculation fix

## 2.3.0 [2021-12-01]

### Added

-  Standardised note and obstacle position and rotation with
   [BeatWalls system](https://camo.githubusercontent.com/295a4c05e569c99c6bf07cfabda8d80afdec1b7d/68747470733a2f2f692e696d6775722e636f6d2f557a37614944672e706e673d31303078313030)
   to allow modded content support
   -  This allows NE/ME map to use the error check functionality
   -  This also allows for more advanced checking in the future
   -  Updated check and threshold to better fit with the system
   -  Because of the change, some functionality may not work as intended (please
      report if you find them)
-  Unlit bomb check

### Changed

-  Switched from Webpack to Vite
-  Cleaned up and updated dependencies

## 2.2.5 [2021-11-11]

### Added

-  Download by hash from BeatSaver
-  LightID to Chroma Environment Enhancement info

### Fixed

-  Light value 8 no longer considered as invalid

## 2.2.4 [2021-10-26]

### Added

-  Spooky Environment support

### Changed

-  Note color check tweaked arrow color

## 2.2.3 [2021-10-21]

### Added

-  Note color check (EXPERIMENTAL)
   -  Similarity (including arrow)

### Fixed

-  Scary error for progression when audio is not loaded

## 2.2.2 [2021-10-17]

### Added

-  Distance input for shrado angle

### Changed

-  shrado angle now checks by distance between note

### Fixed

-  Potential fix for NJS HJD minimum

## 2.2.1 [2021-10-10]

### Changed

-  Hitbox path now checks for diagonal
-  Updated SPS requirement for 7:00 to 6:00

### Fixed

-  Hitbox path picking up bomb as note

## 2.2.0 [2021-10-08]

### Added

-  Skrillex & Billie Eilish environment support
-  Difficulty version for Information
-  Old value 4 event check for old map
-  Warning for long audio loading
-  Hitbox path check

### Changed

-  NJS HJD minimum limit reduced to 0.25 to accomodate v1.18.1 update
-  Mapping Extensions and Noodle Extensions now have basic check for valid (and
   negative) notes and obstacles
-  Plenty of code clean-up

### Fixed

-  NJS dependent check corrected formula (this affects inline, reverse stair, and
   stacked bomb)

### Deprecated

-  Map version older than v2.5.0 no longer gets support for event

## 2.1.1 [2021-09-05]

### Changed

-  Bomb stack now checks by both NJS and time (<20ms)

## 2.1.0 [2021-09-04]

### Added

-  Parity check (EXPERIMENTAL: please send feedback)
-  2-wide center wall recovery input

### Changed

-  Bomb stack now checks by NJS instead of time
-  Minor code clean up

### Fixed

-  Varying speed slider not picking up stack + slider
-  Mistaken 2-wide center wall for negative wall
-  BeatSaver link not having correct URL

## 2.0.3 [2021-08-27]

### Fixed

-  BeatSaver download not having correct request URL

## 2.0.2 [2021-08-08]

### Changed

-  Accordion button resized for mobile device

### Fixed

-  Invalid obstacle picking up 4-wide crouch wall

## 2.0.1 [2021-08-06]

### Added

-  Mobile friendly support

### Changed

-  Re-enabled BeatSaver Download
-  QoL update for VB tool

### Fixed

-  Invalid event picking up laser rotation of high value

## 2.0.0 : TypeScript Rewrite [2021-08-05]

### Added

-  Information Tab
   -  SongCore, Chroma & Noodle Extensions related stuff
-  Stats Tab
-  Settings Tab
   -  Saves to local storage
-  Theme
-  Audio player
-  Mode and difficulty ordering
-  Note Angle stats
-  Improved Note Placement stats
-  Partial Mapping Extensions and Noodle Extensions support

### Changed

-  Codebase rewritten
-  Improved tools
-  Updated SPS requirement
-  BeatSaver ID download temporarily disabled

### Fixed

-  Potential miscalculation on Chroma count
