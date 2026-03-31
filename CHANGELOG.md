# Changelog

## 2.7.6 [2026-03-28]

```diff
+ GLS event OOB check
```

## 2.7.5 [2026-01-11]

```diff
+ Added Spoooky, Cube and Coldplay environment support
+ Improved check output time readability
* Proper light check
* Fixed error related to arc calculation
* Fixed loading accuracy
* Adjusted default preset
```

## 2.7.4 [2025-09-05]

```diff
* Fixed arc tail proximity bomb not accounting existing tail note
* Fixed angle offset check not respecting option
* Updated change log format
```

## 2.7.3 [2025-08-24]

```diff
+ Added chroma note color check
+ Added timing difference check
  + Compares current difficulty with difficulty above
+ Improper arc now check for disconnected and intersection
+ Added criteria check for arc and chain (both SS and BL)
+ Chain link is now generated and counted towards certain checks
* HTML tweak
* Fixed BPM change being shown regardless if it is single BPM
* Optimised inline angle and unlit bomb check
```

## 2.7.2 [2025-08-20]

```diff
* Fixed Mapping Extensions angle calculation not using actual angle for base direction
```

## 2.7.1 [2025-08-02]

```diff
* Now uses modded value position/angle when applicable
  * Prioritise Noodle Extensions if both ME and NE is used
* Reduced time overlap for hammer hit
* Fixed some check not using precalculated time
* Fixed progression check
* Temporarily removed hitbox path check for dot
```

## 2.7.0 [2025-07-23]

Major changes here should result in better QoL, faster loading, and less memory
usage.

```diff
+ Added environment & color scheme
  + Collider
  + Britney Spears
  + Monstercat 2.0
  + Metallica
+ Added checks preset
+ Added bookmark export
+ Added checks for nested folder loading
+ Added several new checks
  + Angle offset
  + Excessive double
  + Hammer hit
  + Handclap pattern
  + Outro
  + Parallel notes
  + Rankable obstacle
  + Variable NJS
* Beatmap core complete overhaul
  * No longer converts beatmap for compatibility
* UI revamped
  * Stats no longer generate all difficulty at once, uses currently selected
  * Overall should result in less memory usage
* Internal changes, now includes integration & regression testing
* Plenty of fixes from regression testing
* Fixed mappers and lighters information does not reset upon reset
* Fixed BPM change shows even if the minimum and maximum are equal
* Fixed stacked bomb, hitbox inline, reverse staircase and short obstacle not accounting for BPM change
* Fixed fallback NJS not being used
- Monochrome theme (bugged)
```

## 2.6.1 [2024-03-25]

```diff
* Fixed potential error when dealing with beatmap of different version
```

## 2.6.0 [2024-03-07]

```diff
+ Added v4 beatmap support
+ Added Lattice and Daft Punk environment & color scheme
+ Added audio duration inferring from BPMInfo.dat and Audio Data
* Now uses v4 beatmap as internal
* Improved loading bar
* Updated many checks
* Rework asynchronous process
  * Should be noticeably faster
* Minor UI tweaks
* Various tweaks and fixes
* Fixed one saber check being missing
* Fixed data check not working properly
* Fixed data check settings not being applied
- Beatmap v3.x.x is now unsupported
  - Beatmap v3 can still be used by map check, but will not gain any feature updated around it.
- Loading bar smoothing
```

## 2.5.15 [2023-10-31]

```diff
+ Added The Rolling Stones environment & color scheme
```

## 2.5.14 [2023-10-12]

```diff
+ Updated to beatmap v3.3.0
  + FX Event Box Group
  + FX Events Collection
+ Added Linkin Park 2.0 environment & color scheme
+ [New SongCore features](https://github.com/Kylemc1413/SongCore/pull/122) (tags, custom characteristic label, etc.)
+ Added One Saber check
+ Added official color scheme and environment per difficulty
* Improved loading logic
  * Can now load beatmap v1
* Loading beatmap can now default missing attributes as given by 1.32 editor update
* The Weeknd and Panic 2.0 color scheme now shows white color value
* New unknown environment now display environment string itself
* Different message for light event check in v3 environment
* Fixed unknown characteristic no longer leave blank in stats page
* Potential SPS progression check fix
```

## 2.5.13 [2023-06-02]

```diff
* Fixed EBPM logic ordering error
* Fixed EBPM threshold should have float error tolerance
```

## 2.5.12 [2023-06-01]

```diff
+ Added Queen environment and color scheme
* Properly calculate effective BPM
```

## 2.5.11 [2023-04-15]

```diff
+ Added Panic 2.0 environment and color scheme
* Arc no longer count towards interactive time
  * While arc can affect scoring, visibility and haptic can be disabled and mostly served as cosmetic
* Bomb should now count towards interactive time (idk why this was filtered in the first place)
* Custom white color should no longer set if boost or non-boost does not exist
- Headless arc check (a valid use since 1.29.0)
```

## 2.5.10 [2023-03-28]

```diff
+ Added dragons 2.0 environment and color scheme
+ Added custom white light support
* Custom color no longer shows non-custom color in information
```

## 2.5.9 [2023-01-10]

```diff
+ Added Rock Mixtape environment and color scheme
* Fixed map with event for keyword could not be loaded
```

## 2.5.8 [2022-11-20]

```diff
* Fixed Progression filtering error
* Potential index filter instantiating error fix
* Fixed index filter validation error for random type and limit affects type
```

## 2.5.7 [2022-11-16]

```diff
+ Event box check
+ Tools output symbol
  + 🚧 Ranking: for rankability reason.
  + ❌ Error: should be fixed unless you know what you are doing.
  + ❗ Warning: not necessarily needed to be fixed but worth considering.
  + ⚠️ Info: no action necessary and worth noting.
* Fixed progression calculation error
* Fixed event box causes error for unused ID
```

## 2.5.6 [2022-11-09]

```diff
+ Beatmap 3.2.0 support
+ The Weeknd environment & color scheme
* Fixed point definitions not being shown
```

## 2.5.5 [2022-10-29]

```diff
* Added play time information
* Added BPM event/change header
* Updated packages and Beat Saber core script
* Fixed obstacle incorrectly counting interactive in specific case
* Fixed version improperly set to `3.0.0` for `3.1.0` map
```

## 2.5.4 [2022-10-07]

```diff
+ Added Lizzo environment & color scheme support
+ Progression check provides more information
  + Per difficulty select
* Updated Beat Saber core script
* Adjusted NJS check
* Hitbox Path now checks for bomb
* Fixed NJS fallback value not being used
```

## 2.5.3 [2022-08-25]

```diff
+ CORS proxy for URL download (thanks, BSMG)
```

## 2.5.2 [2022-08-16]

```diff
* Improved UI look
* v2 Waypoints is now optional
* Fixed boost event count crash for v3 environment map
```

## 2.5.1 [2022-08-09]

```diff
+ Added Chroma geometry support
+ Added bookmark color
+ Added adjustable information table height
+ Added v3 BPM change support
* Updated to latest dependencies
* Fixed EBPM points to current note instead of next note
* Fixed color boost not counted in stats
* Fixed typo
```

## 2.5.0 [2022-06-19]

```diff
+ Added v3 beatmap support
+ v2 to v3 beatmap internal conversion
  + This may be inaccurate for modded v2 map as it internally convert modded to v3
+ Added Weave, Pyro and EDM environment
+ Added Basic slider and burst slider check
+ Added More tool check including general
+ Added Tool check hover tooltip
+ Added More stats for v3 stuff
+ Added Dynamic event name based on environment
+ Added Beat numbering and rounding settings
  + Shows alternative on hover
+ Standard style format (development)
* Yet another major structure changes
* Better internal user interface work
* All check can now be toggled
* v2 event floatValue and v2 obstacle lineLayer & height is now optional
* Package dependencies updated to latest
* Changelog date format
- Beatmap v2.x.x is now unsupported
  - Beatmap v2 can still be used by map check, but will not gain any feature updated around it.
- Removed old event value check
- Removed event peak and per second check
- Removed negative obstacle check (invalid check already points it)
```

## 2.4.0 [2022-03-02]

```diff
* Major structure change (for better development)
* Download from URL changes to download from ID if it detects valid BeatSaver map link
* Time spent now shows HH:MM:SS instead of HH:MM
* Actually added Gaga color scheme
* Restructured custom mod stuff
- CORS proxy (I don't think this is even needed anymore)
```

## 2.3.1 [2022-01-04]

```diff
+ Added event type list per environment
+ Added basic Chroma check for unlit bomb check
+ Added Gaga environment support
+ Added JSDoc for development purpose
* Updated parsing
  * Checks for type
  * Handle missing properties
* Updated Chroma properties
* Updated hitbox check now uses new position/rotation system (except staircase)
* Hitbox inline and reverse staircase calculation fix
```

## 2.3.0 [2021-12-01]

```diff
+ Standardised note and obstacle position and rotation with
  [BeatWalls system](https://camo.githubusercontent.com/295a4c05e569c99c6bf07cfabda8d80afdec1b7d/68747470733a2f2f692e696d6775722e636f6d2f557a37614944672e706e673d31303078313030) to allow modded content support
  + This allows NE/ME map to use the error check functionality
  + This also allows for more advanced checking in the future
  + Updated check and threshold to better fit with the system
  + Because of the change, some functionality may not work as intended (please report if you find them)
+ Added unlit bomb check
* Switched from Webpack to Vite
* Cleaned up and updated dependencies
```

## 2.2.5 [2021-11-11]

```diff
+ Added download by hash from BeatSaver
+ Added LightID to Chroma Environment Enhancement info
* Light value 8 no longer considered as invalid
```

## 2.2.4 [2021-10-26]

```diff
+ Added Spooky Environment support
* Note color check tweaked arrow color
```

## 2.2.3 [2021-10-21]

```diff
+ Added note color check (EXPERIMENTAL)
  + Similarity (including arrow)
* Scary error for progression when audio is not loaded
```

## 2.2.2 [2021-10-17]

```diff
+ Added distance input for shrado angle
* shrado angle now checks by distance between note
* Potential fix for NJS HJD minimum
```

## 2.2.1 [2021-10-10]

```diff
* Hitbox path now checks for diagonal
* Updated SPS requirement for 7:00 to 6:00
* Fixed hitbox path picking up bomb as note
```

## 2.2.0 [2021-10-08]

```diff
+ Added Skrillex & Billie Eilish environment support
+ Added difficulty version for Information
+ Added old value 4 event check for old map
+ Added warning for long audio loading
+ Added hitbox path check
* NJS HJD minimum limit reduced to 0.25 to accomodate v1.18.1 update
* Mapping Extensions and Noodle Extensions now have basic check for valid (and negative) notes and obstacles
* Plenty of code clean-up
* NJS dependent check corrected formula (this affects inline, reverse stair, and stacked bomb)
- Map version older than v2.5.0 no longer gets support for event
```

## 2.1.1 [2021-09-05]

```diff
* Bomb stack now checks by both NJS and time (<20ms)
```

## 2.1.0 [2021-09-04]

```diff
+ Added parity check (EXPERIMENTAL: please send feedback)
+ Added 2-wide center wall recovery input
* Bomb stack now checks by NJS instead of time
* Minor code clean up
* Fixed Varying speed slider not picking up stack + slider
* Fixed 2-wide center wall mistaken for negative wall
* Fixed BeatSaver link not having correct URL
```

## 2.0.3 [2021-08-27]

```diff
* Fixed BeatSaver download not having correct request URL
```

## 2.0.2 [2021-08-08]

```diff
* Accordion button resized for mobile device
* Fixed invalid obstacle picking up 4-wide crouch wall
```

## 2.0.1 [2021-08-06]

```diff
+ Added mobile friendly support
* Re-enabled BeatSaver Download
* QoL update for VB tool
* Fixed invalid event picking up laser rotation of high value
```

## 2.0.0 : TypeScript Rewrite [2021-08-05]

```diff
+ Added information Tab
  + SongCore, Chroma & Noodle Extensions related stuff
+ Added stats Tab
+ Added settings Tab
  + Saves to local storage
+ Added theme
+ Added audio player
+ Added mode and difficulty ordering
+ Added Note Angle stats
+ Added Improved Note Placement stats
+ Added Partial Mapping Extensions and Noodle Extensions support
* Codebase rewritten
* Improved tools
* Updated SPS requirement
* BeatSaver ID download temporarily disabled
* Fixed potential miscalculation on Chroma count
```
