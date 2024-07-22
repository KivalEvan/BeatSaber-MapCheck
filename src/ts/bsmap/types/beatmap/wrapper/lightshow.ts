import type { IWrapWaypoint, IWrapWaypointAttribute } from './waypoint.ts';
import type { IWrapBasicEvent, IWrapBasicEventAttribute } from './basicEvent.ts';
import type { IWrapColorBoostEvent, IWrapColorBoostEventAttribute } from './colorBoostEvent.ts';
import type {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from './lightColorEventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from './lightRotationEventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from './lightTranslationEventBoxGroup.ts';
import type {
   IWrapBasicEventTypesWithKeywords,
   IWrapBasicEventTypesWithKeywordsAttribute,
} from './basicEventTypesWithKeywords.ts';
import type { DeepPartial } from '../../utils.ts';
import type { IWrapFxEventBoxGroup, IWrapFxEventBoxGroupAttribute } from './fxEventBoxGroup.ts';
import type { ICustomDataDifficulty } from './custom/difficulty.ts';
import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';

export interface IWrapLightshowAttribute extends IWrapBaseItemAttribute {
   waypoints: IWrapWaypointAttribute[];
   basicEvents: IWrapBasicEventAttribute[];
   colorBoostEvents: IWrapColorBoostEventAttribute[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroupAttribute[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroupAttribute[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroupAttribute[];
   fxEventBoxGroups: IWrapFxEventBoxGroupAttribute[];
   basicEventTypesWithKeywords: IWrapBasicEventTypesWithKeywordsAttribute;
   useNormalEventsAsCompatibleEvents: boolean;
   customData: ICustomDataDifficulty;
}

export interface IWrapLightshow extends Omit<IWrapBaseItem, 'customData'>, IWrapLightshowAttribute {
   waypoints: IWrapWaypoint[];
   basicEvents: IWrapBasicEvent[];
   colorBoostEvents: IWrapColorBoostEvent[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
   fxEventBoxGroups: IWrapFxEventBoxGroup[];
   basicEventTypesWithKeywords: IWrapBasicEventTypesWithKeywords;

   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   addWaypoints(...data: Partial<IWrapWaypointAttribute>[]): this;
   addBasicEvents(...data: Partial<IWrapBasicEventAttribute>[]): this;
   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute>[]): this;
   addLightColorEventBoxGroups(...data: DeepPartial<IWrapLightColorEventBoxGroupAttribute>[]): this;
   addLightRotationEventBoxGroups(
      ...data: DeepPartial<IWrapLightRotationEventBoxGroupAttribute>[]
   ): this;
   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<IWrapLightTranslationEventBoxGroupAttribute>[]
   ): this;
   addFxEventBoxGroups(...data: DeepPartial<IWrapFxEventBoxGroupAttribute>[]): this;
}
