import { INote } from './note';
import { ISlider } from './slider';
import { IObstacle } from './obstacle';
import { IEvent } from './event';
import { IWaypoint } from './waypoint';
import { ICustomDataDifficulty } from './customData';
import { ISpecialEventsKeywordFilters } from './specialEventsKeywordFilters';

/** Difficulty interface for difficulty file. */
export interface IDifficulty {
    _version: `2.${0 | 2 | 4 | 5 | 6}.0`;
    _notes: INote[];
    _sliders: ISlider[];
    _obstacles: IObstacle[];
    _events: IEvent[];
    _waypoints: IWaypoint[];
    _specialEventsKeywordFilters?: ISpecialEventsKeywordFilters;
    _customData?: ICustomDataDifficulty;
}
