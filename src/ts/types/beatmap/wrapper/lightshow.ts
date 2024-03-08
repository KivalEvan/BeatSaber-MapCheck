// deno-lint-ignore-file no-explicit-any
import { IWrapEvent, IWrapEventAttribute } from './event';
import { IWrapColorBoostEvent, IWrapColorBoostEventAttribute } from './colorBoostEvent';
import {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from './lightColorEventBoxGroup';
import {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from './lightRotationEventBoxGroup';
import {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from './lightTranslationEventBoxGroup';
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { DeepPartial, LooseAutocomplete } from '../../utils';
import { GenericFilename, IFileInfo } from '../shared/filename';
import { EventContainer } from './container';
import { IWrapFxEventBoxGroup, IWrapFxEventBoxGroupAttribute } from './fxEventBoxGroup';
import { IWrapWaypoint } from './waypoint';
import { IWrapWaypointAttribute } from './waypoint';
import { Version } from '../shared/version';
import {
   IWrapEventTypesWithKeywords,
   IWrapEventTypesWithKeywordsAttribute,
} from './eventTypesWithKeywords';

export interface IWrapLightshowAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItemAttribute<T>,
      IFileInfo {
   readonly version: Version;
   waypoints: IWrapWaypointAttribute[];
   basicEvents: IWrapEventAttribute[];
   colorBoostEvents: IWrapColorBoostEventAttribute[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroupAttribute[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroupAttribute[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroupAttribute[];
   fxEventBoxGroups: IWrapFxEventBoxGroupAttribute[];
   eventTypesWithKeywords: IWrapEventTypesWithKeywordsAttribute;
   useNormalEventsAsCompatibleEvents: boolean;
}

export interface IWrapLightshow<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapLightshowAttribute<T> {
   waypoints: IWrapWaypoint[];
   basicEvents: IWrapEvent[];
   colorBoostEvents: IWrapColorBoostEvent[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
   fxEventBoxGroups: IWrapFxEventBoxGroup[];
   eventTypesWithKeywords: IWrapEventTypesWithKeywords;

   setFilename(filename: LooseAutocomplete<GenericFilename>): this;

   /** Sort beatmap object(s) accordingly. */
   sort(): this;

   /**
    * Reparse the beatmap to their respective schema class.
    *
    * Used to match the beatmap schema if wrapper mix-and-matched the class.
    * ```ts
    * if (!difficulty.isValid()) {
    *     difficulty.reparse();
    * }
    * ```
    *
    * **NOTE:** This will create a new set of array,
    * `keepRef` allows for already matched object to stay in new array instead of creating new object (this is faster and less memory but can cause reference issue)
    */
   reparse(keepRef?: boolean): this;

   /**
    * Get container of basic events and boost events.
    * ```ts
    * const noteCountainer = getNoteContainer(Difficulty);
    * ```
    */
   getEventContainer(): EventContainer[];

   addWaypoints(...data: Partial<IWrapWaypointAttribute>[]): this;
   addBasicEvents(...data: Partial<IWrapEventAttribute>[]): this;
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
