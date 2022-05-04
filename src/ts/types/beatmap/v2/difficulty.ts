import { INote } from './note';
import { ISlider } from './slider';
import { IObstacle } from './obstacle';
import { IEvent } from './event';
import { IWaypoint } from './waypoint';
import { ICustomDataDifficultyV2 } from '../shared/customData';
import { ISpecialEventsKeywordFilters } from './specialEventsKeywordFilters';

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
export interface IDifficultyData {
    _version: `2.${0 | 2 | 4 | 5 | 6}.0`;
    _notes: INote[];
    _sliders: ISlider[];
    _obstacles: IObstacle[];
    _events: IEvent[];
    _waypoints: IWaypoint[];
    _specialEventsKeywordFilters?: ISpecialEventsKeywordFilters;
    _customData?: ICustomDataDifficultyV2;
}
