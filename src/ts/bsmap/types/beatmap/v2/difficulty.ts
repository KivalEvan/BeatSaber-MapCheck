import type { INote } from './note.ts';
import type { IArc } from './arc.ts';
import type { IObstacle } from './obstacle.ts';
import type { IEvent } from './event.ts';
import type { IWaypoint } from './waypoint.ts';
import type { ICustomDataDifficulty } from './custom/difficulty.ts';
import type { ISpecialEventsKeywordFilters } from './specialEventsKeywordFilters.ts';

/** Difficulty interface for difficulty file. */
export interface IDifficulty {
   _version?: `2.${0 | 2 | 4 | 5 | 6}.0`;
   _notes?: INote[];
   _sliders?: IArc[];
   _obstacles?: IObstacle[];
   _events?: IEvent[];
   _waypoints?: IWaypoint[];
   _specialEventsKeywordFilters?: ISpecialEventsKeywordFilters;
   _customData?: ICustomDataDifficulty;
}
