import type { ILightshow } from '../../types/beatmap/v4/lightshow.ts';
import { Waypoint } from './waypoint.ts';
import { BasicEvent } from './basicEvent.ts';
import { ColorBoostEvent } from './colorBoostEvent.ts';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup.ts';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup.ts';
import { LightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup.ts';
import { FxEventBoxGroup } from './fxEventBoxGroup.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightshow } from '../wrapper/lightshow.ts';
import type { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import type { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { ILightColorEventBox } from '../../types/beatmap/v4/lightColorEventBox.ts';
import type { ILightRotationEventBox } from '../../types/beatmap/v4/lightRotationEventBox.ts';
import type { ILightTranslationEventBox } from '../../types/beatmap/v4/lightTranslationEventBox.ts';
import type { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import type { IFxEventBox } from '../../types/beatmap/v4/fxEventBox.ts';
import type { IWrapWaypointAttribute } from '../../types/beatmap/wrapper/waypoint.ts';
import { BasicEventTypesWithKeywords } from '../v3/basicEventTypesWithKeywords.ts';
import type { ILightColorEvent } from '../../types/beatmap/v4/lightColorEvent.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v4/lightRotationEvent.ts';
import type { ILightTranslationEvent } from '../../types/beatmap/v4/lightTranslationEvent.ts';
import type { IEventBoxGroup } from '../../types/beatmap/v4/eventBoxGroup.ts';
import type {
   IBasicEventContainer,
   IColorBoostEventContainer,
   IWaypointContainer,
} from '../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../types/beatmap/shared/constants.ts';
import type { IObject } from '../../types/beatmap/v4/object.ts';
import type { IWrapLightshowAttribute } from '../../types/beatmap/wrapper/lightshow.ts';
import type { IFxEventFloat } from '../../types/beatmap/v4/fxEventFloat.ts';

/** Lightshow beatmap v4 class object. */
export class Lightshow extends WrapLightshow<ILightshow> {
   static default: DeepRequiredIgnore<ILightshow, 'customData'> = {
      version: '4.0.0',
      waypoints: [],
      waypointsData: [],
      basicEvents: [],
      basicEventsData: [],
      colorBoostEvents: [],
      colorBoostEventsData: [],
      eventBoxGroups: [],
      indexFilters: [],
      lightColorEvents: [],
      lightColorEventBoxes: [],
      lightRotationEvents: [],
      lightRotationEventBoxes: [],
      lightTranslationEvents: [],
      lightTranslationEventBoxes: [],
      floatFxEvents: [],
      fxEventBoxes: [],
      basicEventTypesWithKeywords: {
         ...BasicEventTypesWithKeywords.default,
      },
      useNormalEventsAsCompatibleEvents: false,
      customData: {},
   };

   readonly version = '4.0.0';
   waypoints: Waypoint[];
   basicEvents: BasicEvent[];
   colorBoostEvents: ColorBoostEvent[];
   lightColorEventBoxGroups: LightColorEventBoxGroup[] = [];
   lightRotationEventBoxGroups: LightRotationEventBoxGroup[] = [];
   lightTranslationEventBoxGroups: LightTranslationEventBoxGroup[] = [];
   fxEventBoxGroups: FxEventBoxGroup[] = [];
   eventTypesWithKeywords: BasicEventTypesWithKeywords;
   useNormalEventsAsCompatibleEvents: boolean;

   static create(data: DeepPartial<IWrapLightshowAttribute<ILightshow>> = {}): Lightshow {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapLightshowAttribute<ILightshow>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data.waypoints) {
         this.waypoints = data.waypoints.map((obj) => new Waypoint(obj));
      } else {
         this.waypoints = Lightshow.default.waypoints.map((json) =>
            Waypoint.fromJSON(json, Lightshow.default.waypointsData[json.i || 0]),
         );
      }
      if (data.basicEvents) {
         this.basicEvents = data.basicEvents.map((obj) => new BasicEvent(obj));
      } else {
         this.basicEvents = Lightshow.default.basicEvents.map((json) =>
            BasicEvent.fromJSON(json, Lightshow.default.basicEventsData[json.i || 0]),
         );
      }
      if (data.colorBoostEvents) {
         this.colorBoostEvents = data.colorBoostEvents.map((obj) => new ColorBoostEvent(obj));
      } else {
         this.colorBoostEvents = Lightshow.default.colorBoostEvents.map((json) =>
            ColorBoostEvent.fromJSON(json, Lightshow.default.colorBoostEventsData[json.i || 0]),
         );
      }
      this.lightColorEventBoxGroups = (data.lightColorEventBoxGroups ?? []).map(
         (obj) => new LightColorEventBoxGroup(obj),
      );
      this.lightRotationEventBoxGroups = (data.lightRotationEventBoxGroups ?? []).map(
         (obj) => new LightRotationEventBoxGroup(obj),
      );
      this.lightTranslationEventBoxGroups = (data.lightTranslationEventBoxGroups ?? []).map(
         (obj) => new LightTranslationEventBoxGroup(obj),
      );
      this.fxEventBoxGroups = (data.fxEventBoxGroups ?? []).map((obj) => new FxEventBoxGroup(obj));
      if (data.eventTypesWithKeywords) {
         this.eventTypesWithKeywords = new BasicEventTypesWithKeywords(data.eventTypesWithKeywords);
      } else {
         this.eventTypesWithKeywords = BasicEventTypesWithKeywords.fromJSON(
            Lightshow.default.basicEventTypesWithKeywords,
         );
      }
      this.useNormalEventsAsCompatibleEvents = !!data.useNormalEventsAsCompatibleEvents;
      this.customData = deepCopy(data.customData ?? {});
   }

   static fromJSON(data: DeepPartial<ILightshow> = {}): Lightshow {
      const d = new this();
      d.waypoints = (data?.waypoints ?? []).map((obj) =>
         Waypoint.fromJSON(obj, data?.waypointsData?.[obj?.i || 0]),
      );
      d.basicEvents = (data?.basicEvents ?? []).map((obj) =>
         BasicEvent.fromJSON(obj, data?.basicEventsData?.[obj?.i || 0]),
      );
      d.colorBoostEvents = (data?.colorBoostEvents ?? []).map((obj) =>
         ColorBoostEvent.fromJSON(obj, data?.colorBoostEventsData?.[obj?.i || 0]),
      );
      for (const ebg of data?.eventBoxGroups || []) {
         const t = ebg?.t || 0;
         switch (t) {
            case EventBoxType.COLOR:
               d.lightColorEventBoxGroups.push(
                  LightColorEventBoxGroup.fromJSON(
                     ebg,
                     data?.lightColorEventBoxes as ILightColorEventBox[],
                     data?.lightColorEvents as ILightColorEvent[],
                     data?.indexFilters as IIndexFilter[],
                  ),
               );
               break;
            case EventBoxType.ROTATION:
               d.lightRotationEventBoxGroups.push(
                  LightRotationEventBoxGroup.fromJSON(
                     ebg,
                     data?.lightRotationEventBoxes as ILightRotationEventBox[],
                     data?.lightRotationEvents as ILightRotationEvent[],
                     data?.indexFilters as IIndexFilter[],
                  ),
               );
               break;
            case EventBoxType.TRANSLATION:
               d.lightTranslationEventBoxGroups.push(
                  LightTranslationEventBoxGroup.fromJSON(
                     ebg,
                     data?.lightTranslationEventBoxes as ILightTranslationEventBox[],
                     data?.lightTranslationEvents as ILightTranslationEvent[],
                     data?.indexFilters as IIndexFilter[],
                  ),
               );
               break;
            case EventBoxType.FX_FLOAT:
               d.fxEventBoxGroups.push(
                  FxEventBoxGroup.fromJSON(
                     ebg,
                     data?.fxEventBoxes as IFxEventBox[],
                     data?.floatFxEvents as IFxEventFloat[],
                     data?.indexFilters as IIndexFilter[],
                  ),
               );
               break;
         }
      }
      d.eventTypesWithKeywords = BasicEventTypesWithKeywords.fromJSON(
         data?.basicEventTypesWithKeywords || Lightshow.default.basicEventTypesWithKeywords,
      );
      d.useNormalEventsAsCompatibleEvents = !!data?.useNormalEventsAsCompatibleEvents;
      d.customData = deepCopy(data?.customData ?? {});
      return d;
   }

   toJSON(): Required<ILightshow> {
      const json: Required<ILightshow> = {
         version: this.version,
         waypoints: [],
         waypointsData: [],
         basicEvents: [],
         basicEventsData: [],
         colorBoostEvents: [],
         colorBoostEventsData: [],
         eventBoxGroups: [],
         indexFilters: [],
         lightColorEventBoxes: [],
         lightColorEvents: [],
         lightRotationEventBoxes: [],
         lightRotationEvents: [],
         lightTranslationEventBoxes: [],
         lightTranslationEvents: [],
         fxEventBoxes: [],
         floatFxEvents: [],
         basicEventTypesWithKeywords: this.eventTypesWithKeywords.toJSON(),
         useNormalEventsAsCompatibleEvents: this.useNormalEventsAsCompatibleEvents,
         customData: deepCopy(this.customData),
      };
      for (const obj of this.waypoints) {
         const jsonObj = obj.toJSON();
         json.waypoints.push(jsonObj.object);
         jsonObj.object.i = json.waypointsData.length;
         json.waypointsData.push(jsonObj.data);
      }
      for (const obj of this.basicEvents) {
         const jsonObj = obj.toJSON();
         json.basicEvents.push(jsonObj.object);
         jsonObj.object.i = json.basicEventsData.length;
         json.basicEventsData.push(jsonObj.data);
      }
      for (const obj of this.colorBoostEvents) {
         const jsonObj = obj.toJSON();
         json.colorBoostEvents.push(jsonObj.object);
         jsonObj.object.i = json.colorBoostEventsData.length;
         json.colorBoostEventsData.push(jsonObj.data);
      }
      for (const obj of this.lightColorEventBoxGroups.map((obj) => obj.toJSON())) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightColorEvents.length,
               });
               json.lightColorEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightColorEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightColorEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of this.lightRotationEventBoxGroups.map((obj) => obj.toJSON())) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightRotationEvents.length,
               });
               json.lightRotationEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightRotationEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightRotationEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of this.lightTranslationEventBoxGroups.map((obj) => obj.toJSON())) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightTranslationEvents.length,
               });
               json.lightTranslationEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightTranslationEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightTranslationEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of this.fxEventBoxGroups.map((obj) => obj.toJSON())) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({ b: evt.time, i: json.floatFxEvents.length });
               json.floatFxEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.fxEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.fxEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }

      return json;
   }

   get customData(): NonNullable<ILightshow['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightshow['customData']>) {
      this._customData = value;
   }

   reparse(keepRef?: boolean): this {
      this.waypoints = this.waypoints.map((obj) => this.createOrKeep(Waypoint, obj, keepRef));
      this.basicEvents = this.basicEvents.map((obj) => this.createOrKeep(BasicEvent, obj, keepRef));
      this.colorBoostEvents = this.colorBoostEvents.map((obj) =>
         this.createOrKeep(ColorBoostEvent, obj, keepRef),
      );
      this.lightColorEventBoxGroups = this.lightColorEventBoxGroups.map((obj) =>
         this.createOrKeep(LightColorEventBoxGroup, obj, keepRef),
      );
      this.lightRotationEventBoxGroups = this.lightRotationEventBoxGroups.map((obj) =>
         this.createOrKeep(LightRotationEventBoxGroup, obj, keepRef),
      );
      this.lightTranslationEventBoxGroups = this.lightTranslationEventBoxGroups.map((obj) =>
         this.createOrKeep(LightTranslationEventBoxGroup, obj, keepRef),
      );
      this.fxEventBoxGroups = this.fxEventBoxGroups.map((obj) =>
         this.createOrKeep(FxEventBoxGroup, obj, keepRef),
      );
      this.eventTypesWithKeywords = new BasicEventTypesWithKeywords(this.eventTypesWithKeywords);

      return this;
   }

   addWaypoints(...data: Partial<IWrapWaypointAttribute<IWaypointContainer>>[]): this {
      for (const obj of data) this.waypoints.push(new Waypoint(obj));
      return this;
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IBasicEventContainer>>[]): this {
      for (const obj of data) this.basicEvents.push(new BasicEvent(obj));
      return this;
   }

   addColorBoostEvents(
      ...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEventContainer>>[]
   ): this {
      for (const obj of data) {
         this.colorBoostEvents.push(new ColorBoostEvent(obj));
      }
      return this;
   }

   addLightColorEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            IEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightColorEventBoxGroups.push(new LightColorEventBoxGroup(obj));
      }
      return this;
   }

   addLightRotationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            IEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightRotationEventBoxGroups.push(new LightRotationEventBoxGroup(obj));
      }
      return this;
   }

   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            IEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationEvent,
            IIndexFilter
         >
      >[]
   ): this {
      for (const obj of data) {
         this.lightTranslationEventBoxGroups.push(new LightTranslationEventBoxGroup(obj));
      }
      return this;
   }

   addFxEventBoxGroups(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IEventBoxGroup, IFxEventBox, IFxEventFloat, IIndexFilter>
      >[]
   ): this {
      for (const obj of data) {
         this.fxEventBoxGroups.push(new FxEventBoxGroup(obj));
      }
      return this;
   }

   isValid(): boolean {
      return (
         this.waypoints.every((obj) => this.checkClass(Waypoint, obj)) &&
         this.basicEvents.every((obj) => this.checkClass(BasicEvent, obj)) &&
         this.colorBoostEvents.every((obj) => this.checkClass(ColorBoostEvent, obj)) &&
         this.lightColorEventBoxGroups.every((obj) =>
            this.checkClass(LightColorEventBoxGroup, obj),
         ) &&
         this.lightRotationEventBoxGroups.every((obj) =>
            this.checkClass(LightRotationEventBoxGroup, obj),
         ) &&
         this.lightTranslationEventBoxGroups.every((obj) =>
            this.checkClass(LightTranslationEventBoxGroup, obj),
         ) &&
         this.fxEventBoxGroups.every((obj) => this.checkClass(FxEventBoxGroup, obj)) &&
         this.eventTypesWithKeywords instanceof BasicEventTypesWithKeywords
      );
   }
}
