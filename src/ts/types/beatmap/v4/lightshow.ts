import { IBasicEventTypesWithKeywords } from '../v3/basicEventTypesWithKeywords';
import { IBasicEvent } from './basicEvent';
import { IColorBoostEvent } from './colorBoostEvent';
import { IEventBoxGroup } from './eventBoxGroup';
import { IFxEventBox } from './fxEventBox';
import { IFxEventFloat } from './fxEventFloat';
import { IIndexFilter } from './indexFilter';
import { IItem } from './item';
import { ILightColorEvent } from './lightColorEvent';
import { ILightColorEventBox } from './lightColorEventBox';
import { ILightRotationEvent } from './lightRotationEvent';
import { ILightRotationEventBox } from './lightRotationEventBox';
import { ILightTranslationEvent } from './lightTranslationEvent';
import { ILightTranslationEventBox } from './lightTranslationEventBox';
import { IObject, IObjectLane } from './object';
import { IWaypoint } from './waypoint';

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
