import type {
   IWrapBasicEvent,
   IWrapBasicEventAttribute,
} from '../../types/beatmap/wrapper/basicEvent.ts';
import type { IWrapBasicEventTypesWithKeywords } from '../../types/beatmap/wrapper/basicEventTypesWithKeywords.ts';
import type {
   IWrapColorBoostEvent,
   IWrapColorBoostEventAttribute,
} from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type {
   IWrapWaypoint,
   IWrapWaypointAttribute,
} from '../../types/beatmap/wrapper/waypoint.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { BaseItem } from './abstract/baseItem.ts';
import type {
   IWrapLightshow,
   IWrapLightshowAttribute,
} from '../../types/beatmap/wrapper/lightshow.ts';
import type {
   IWrapFxEventBoxGroup,
   IWrapFxEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import { sortObjectFn } from '../helpers/sort.ts';
import { Waypoint } from './waypoint.ts';
import { BasicEvent } from './basicEvent.ts';
import { ColorBoostEvent } from './colorBoostEvent.ts';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup.ts';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup.ts';
import { LightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup.ts';
import { FxEventBoxGroup } from './fxEventBoxGroup.ts';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords.ts';
import { deepCopy } from '../../utils/misc.ts';

export class Lightshow extends BaseItem implements IWrapLightshow {
   static defaultValue: IWrapLightshowAttribute = {
      waypoints: [],
      basicEvents: [],
      colorBoostEvents: [],
      lightColorEventBoxGroups: [],
      lightRotationEventBoxGroups: [],
      lightTranslationEventBoxGroups: [],
      fxEventBoxGroups: [],
      basicEventTypesWithKeywords: { list: [] },
      useNormalEventsAsCompatibleEvents: false,
      customData: {},
   };

   static create(...data: DeepPartialIgnore<IWrapLightshowAttribute, 'customData'>[]): Lightshow[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapLightshowAttribute, 'customData'> = {}) {
      super();
      this.waypoints = (data.waypoints ?? Lightshow.defaultValue.waypoints).map(
         (e) => new Waypoint(e),
      );
      this.basicEvents = (data.basicEvents ?? Lightshow.defaultValue.basicEvents).map(
         (e) => new BasicEvent(e),
      );
      // shut the fuck up, ts, it's not that deep
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      this.colorBoostEvents = (
         data.colorBoostEvents ?? Lightshow.defaultValue.colorBoostEvents
      ).map((e) => new ColorBoostEvent(e));
      this.lightColorEventBoxGroups = (
         data.lightColorEventBoxGroups ?? Lightshow.defaultValue.lightColorEventBoxGroups
      ).map((e) => new LightColorEventBoxGroup(e));
      this.lightRotationEventBoxGroups = (
         data.lightRotationEventBoxGroups ?? Lightshow.defaultValue.lightRotationEventBoxGroups
      ).map((e) => new LightRotationEventBoxGroup(e));
      this.lightTranslationEventBoxGroups = (
         data.lightTranslationEventBoxGroups ??
         Lightshow.defaultValue.lightTranslationEventBoxGroups
      ).map((e) => new LightTranslationEventBoxGroup(e));
      this.fxEventBoxGroups = (
         data.fxEventBoxGroups ?? Lightshow.defaultValue.fxEventBoxGroups
      ).map((e) => new FxEventBoxGroup(e));
      this.basicEventTypesWithKeywords = {
         list: (
            data.basicEventTypesWithKeywords?.list ??
            Lightshow.defaultValue.basicEventTypesWithKeywords.list
         ).map((e) => new BasicEventTypesForKeywords(e)),
      };
      this.useNormalEventsAsCompatibleEvents = !!data.useNormalEventsAsCompatibleEvents;
      this.customData = deepCopy(data.customData ?? Lightshow.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn, override)
         : super.isValid(fn, override) &&
              this.waypoints.every((e) => e.isValid()) &&
              this.basicEvents.every((e) => e.isValid()) &&
              this.colorBoostEvents.every((e) => e.isValid()) &&
              this.lightColorEventBoxGroups.every((e) => e.isValid()) &&
              this.lightRotationEventBoxGroups.every((e) => e.isValid()) &&
              this.lightTranslationEventBoxGroups.every((e) => e.isValid()) &&
              this.fxEventBoxGroups.every((e) => e.isValid()) &&
              this.basicEventTypesWithKeywords.list.every((e) => e.isValid());
   }

   waypoints: IWrapWaypoint[];
   basicEvents: IWrapBasicEvent[];
   colorBoostEvents: IWrapColorBoostEvent[];
   lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
   lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
   fxEventBoxGroups: IWrapFxEventBoxGroup[];
   basicEventTypesWithKeywords: IWrapBasicEventTypesWithKeywords;
   useNormalEventsAsCompatibleEvents: boolean;

   sort(): this {
      this.waypoints.sort(sortObjectFn);
      this.basicEvents.sort(sortObjectFn);
      this.colorBoostEvents.sort(sortObjectFn);
      this.lightColorEventBoxGroups.sort(sortObjectFn);
      this.lightRotationEventBoxGroups.sort(sortObjectFn);
      this.lightTranslationEventBoxGroups.sort(sortObjectFn);
      this.fxEventBoxGroups.sort(sortObjectFn);

      for (let i = 0; i < this.lightColorEventBoxGroups.length; i++) {
         for (let j = 0; j < this.lightColorEventBoxGroups[i].boxes.length; j++) {
            this.lightColorEventBoxGroups[i].boxes[j].events.sort(sortObjectFn);
         }
      }
      for (let i = 0; i < this.lightRotationEventBoxGroups.length; i++) {
         for (let j = 0; j < this.lightRotationEventBoxGroups[i].boxes.length; j++) {
            this.lightRotationEventBoxGroups[i].boxes[j].events.sort(sortObjectFn);
         }
      }
      for (let i = 0; i < this.lightTranslationEventBoxGroups.length; i++) {
         for (let j = 0; j < this.lightTranslationEventBoxGroups[i].boxes.length; j++) {
            this.lightTranslationEventBoxGroups[i].boxes[j].events.sort(sortObjectFn);
         }
      }
      for (let i = 0; i < this.fxEventBoxGroups.length; i++) {
         for (let j = 0; j < this.fxEventBoxGroups[i].boxes.length; j++) {
            this.fxEventBoxGroups[i].boxes[j].events.sort(sortObjectFn);
         }
      }

      return this;
   }

   addWaypoints(...data: DeepPartialIgnore<IWrapWaypointAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.waypoints.push(new Waypoint(d));
      }
      return this;
   }
   addBasicEvents(...data: DeepPartialIgnore<IWrapBasicEventAttribute, 'customData'>[]): this {
      for (const d of data) {
         this.basicEvents.push(new BasicEvent(d));
      }
      return this;
   }
   addColorBoostEvents(
      ...data: DeepPartialIgnore<IWrapColorBoostEventAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.colorBoostEvents.push(new ColorBoostEvent(d));
      }
      return this;
   }
   addLightColorEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightColorEventBoxGroupAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.lightColorEventBoxGroups.push(new LightColorEventBoxGroup(d));
      }
      return this;
   }
   addLightRotationEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightRotationEventBoxGroupAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.lightRotationEventBoxGroups.push(new LightRotationEventBoxGroup(d));
      }
      return this;
   }
   addLightTranslationEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapLightTranslationEventBoxGroupAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.lightTranslationEventBoxGroups.push(new LightTranslationEventBoxGroup(d));
      }
      return this;
   }
   addFxEventBoxGroups(
      ...data: DeepPartialIgnore<IWrapFxEventBoxGroupAttribute, 'customData'>[]
   ): this {
      for (const d of data) {
         this.fxEventBoxGroups.push(new FxEventBoxGroup(d));
      }
      return this;
   }
}
