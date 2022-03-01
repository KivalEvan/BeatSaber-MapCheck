import { Note } from './note';
import { Slider } from './slider';
import { Obstacle } from './obstacle';
import { Event } from './event';
import { Waypoint } from './waypoint';
import { CustomDataDifficulty } from './customData';

// yea i dont even know but it exist
export interface SpecialEventsKeywordFilters {
    _keywords: SpecialEventsKeywordFiltersKeywords[];
}

export interface SpecialEventsKeywordFiltersKeywords {
    _keyword: string;
    _specialEvents: number[];
}

/** Difficulty interface for difficulty file.
 * ```ts
 * _version: string,
 * _notes: Note[],
 * _obstacles: Obstacle[],
 * _events: Event[],
 * _waypoints: Waypoint[],
 * _specialEventsKeywordFilters?: SpecialEventsKeywordFilters,
 * _customData?: CustomDataDifficulty
 * ```
 */
export interface DifficultyData {
    _version: `2.${0 | 2 | 5 | 6}.0`;
    _notes: Note[];
    _sliders: Slider[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints: Waypoint[];
    _specialEventsKeywordFilters?: SpecialEventsKeywordFilters;
    _customData?: CustomDataDifficulty;
}
