import type { IBasicEventTypesWithKeywords } from '../v3/basicEventTypesWithKeywords.ts';
import type { IBasicEvent } from './basicEvent.ts';
import type { IColorBoostEvent } from './colorBoostEvent.ts';
import type { IEventBoxGroup } from './eventBoxGroup.ts';
import type { IFxEventBox } from './fxEventBox.ts';
import type { IFxEventFloat } from './fxEventFloat.ts';
import type { IIndexFilter } from './indexFilter.ts';
import type { IItem } from './item.ts';
import type { ILightColorEvent } from './lightColorEvent.ts';
import type { ILightColorEventBox } from './lightColorEventBox.ts';
import type { ILightRotationEvent } from './lightRotationEvent.ts';
import type { ILightRotationEventBox } from './lightRotationEventBox.ts';
import type { ILightTranslationEvent } from './lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from './lightTranslationEventBox.ts';
import type { IObject, IObjectLane } from './object.ts';
import type { IWaypoint } from './waypoint.ts';

export interface ILightshow extends IItem {
   version: '4.0.0';
   waypoints: IObjectLane[];
   waypointsData: IWaypoint[];
   basicEvents: IObject[];
   basicEventsData: IBasicEvent[];
   colorBoostEvents: IObject[];
   colorBoostEventsData: IColorBoostEvent[];
   eventBoxGroups: IEventBoxGroup[];
   indexFilters: IIndexFilter[];
   lightColorEventBoxes: ILightColorEventBox[];
   lightColorEvents: ILightColorEvent[];
   lightRotationEventBoxes: ILightRotationEventBox[];
   lightRotationEvents: ILightRotationEvent[];
   lightTranslationEventBoxes: ILightTranslationEventBox[];
   lightTranslationEvents: ILightTranslationEvent[];
   fxEventBoxes: IFxEventBox[];
   floatFxEvents: IFxEventFloat[];
   basicEventTypesWithKeywords: IBasicEventTypesWithKeywords;
   useNormalEventsAsCompatibleEvents: boolean;
}
