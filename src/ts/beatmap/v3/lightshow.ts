import { ILightshow } from '../../types/beatmap/v3/lightshow';
import { BasicEvent } from './basicEvent';
import { ColorBoostEvent } from './colorBoostEvent';
import { LightColorEventBoxGroup } from './lightColorEventBoxGroup';
import { LightRotationEventBoxGroup } from './lightRotationEventBoxGroup';
import { LightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { WrapLightshow } from '../wrapper/lightshow';
import { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';
import { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { ILightColorEvent } from '../../types/beatmap/v3/lightColorEvent';
import { ILightRotationEvent } from '../../types/beatmap/v3/lightRotationEvent';
import { ILightTranslationEvent } from '../../types/beatmap/v3/lightTranslationEvent';
import { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { FxEventBoxGroup } from './fxEventBoxGroup';
import { BasicEventTypesWithKeywords } from './basicEventTypesWithKeywords';
import logger from '../../logger';
import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';
import { IWrapLightshowAttribute } from '../../types/beatmap/wrapper/lightshow';

function tag(name: string): string[] {
   return ['beatmap', 'v3', 'lightshow', name];
}

/** Lightshow beatmap v3 class object. */
export class Lightshow extends WrapLightshow<ILightshow> {
   static default: Required<ILightshow> = {
      basicBeatmapEvents: [],
      colorBoostBeatmapEvents: [],
      lightColorEventBoxGroups: [],
      lightRotationEventBoxGroups: [],
      lightTranslationEventBoxGroups: [],
      vfxEventBoxGroups: [],
      _fxEventsCollection: { _fl: [], _il: [] },
      customData: {},
   };
   readonly version = '3.3.0';
   waypoints: never[] = [];
   basicEvents: BasicEvent[];
   colorBoostEvents: ColorBoostEvent[];
   lightColorEventBoxGroups: LightColorEventBoxGroup[];
   lightRotationEventBoxGroups: LightRotationEventBoxGroup[];
   lightTranslationEventBoxGroups: LightTranslationEventBoxGroup[];
   fxEventBoxGroups: FxEventBoxGroup[];
   eventTypesWithKeywords: BasicEventTypesWithKeywords = new BasicEventTypesWithKeywords();
   useNormalEventsAsCompatibleEvents = true;

   static create(data: DeepPartial<IWrapLightshowAttribute<ILightshow>> = {}): Lightshow {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapLightshowAttribute<ILightshow>> = {}) {
      super();
      this.filename = data.filename ?? this.filename;
      if (data.basicEvents) {
         this.basicEvents = data.basicEvents.map((obj) => new BasicEvent(obj));
      } else {
         this.basicEvents = Lightshow.default.basicBeatmapEvents.map((json) =>
            BasicEvent.fromJSON(json),
         );
      }
      if (data.colorBoostEvents) {
         this.colorBoostEvents = data.colorBoostEvents.map((obj) => new ColorBoostEvent(obj));
      } else {
         this.colorBoostEvents = Lightshow.default.colorBoostBeatmapEvents.map((json) =>
            ColorBoostEvent.fromJSON(json),
         );
      }
      if (data.lightColorEventBoxGroups) {
         this.lightColorEventBoxGroups = data.lightColorEventBoxGroups.map(
            (obj) => new LightColorEventBoxGroup(obj),
         );
      } else {
         this.lightColorEventBoxGroups = Lightshow.default.lightColorEventBoxGroups.map((json) =>
            LightColorEventBoxGroup.fromJSON(json),
         );
      }
      if (data.lightRotationEventBoxGroups) {
         this.lightRotationEventBoxGroups = data.lightRotationEventBoxGroups.map(
            (obj) => new LightRotationEventBoxGroup(obj),
         );
      } else {
         this.lightRotationEventBoxGroups = Lightshow.default.lightRotationEventBoxGroups.map(
            (json) => LightRotationEventBoxGroup.fromJSON(json),
         );
      }
      if (data.lightTranslationEventBoxGroups) {
         this.lightTranslationEventBoxGroups = data.lightTranslationEventBoxGroups.map(
            (obj) => new LightTranslationEventBoxGroup(obj),
         );
      } else {
         this.lightTranslationEventBoxGroups = Lightshow.default.lightTranslationEventBoxGroups.map(
            (json) => LightTranslationEventBoxGroup.fromJSON(json),
         );
      }
      if (data.fxEventBoxGroups) {
         this.fxEventBoxGroups = data.fxEventBoxGroups.map((obj) => new FxEventBoxGroup(obj));
      } else {
         this.fxEventBoxGroups = Lightshow.default.vfxEventBoxGroups.map((json) =>
            FxEventBoxGroup.fromJSON(json),
         );
      }
      this.customData = deepCopy(data.customData ?? Lightshow.default.customData);
   }

   static fromJSON(data: DeepPartial<ILightshow> = {}): Lightshow {
      const d = new this();
      d.basicEvents = (data.basicBeatmapEvents ?? Lightshow.default.basicBeatmapEvents).map((obj) =>
         BasicEvent.fromJSON(obj),
      );
      d.colorBoostEvents = (
         data.colorBoostBeatmapEvents ?? Lightshow.default.colorBoostBeatmapEvents
      ).map((obj) => ColorBoostEvent.fromJSON(obj));
      d.lightColorEventBoxGroups = (
         data.lightColorEventBoxGroups ?? Lightshow.default.lightColorEventBoxGroups
      ).map((obj) => LightColorEventBoxGroup.fromJSON(obj));
      d.lightRotationEventBoxGroups = (
         data.lightRotationEventBoxGroups ?? Lightshow.default.lightRotationEventBoxGroups
      ).map((obj) => LightRotationEventBoxGroup.fromJSON(obj));
      d.lightTranslationEventBoxGroups = (
         data.lightTranslationEventBoxGroups ?? Lightshow.default.lightTranslationEventBoxGroups
      ).map((obj) => LightTranslationEventBoxGroup.fromJSON(obj));
      d.fxEventBoxGroups = (data.vfxEventBoxGroups ?? Lightshow.default.vfxEventBoxGroups).map(
         (obj) =>
            FxEventBoxGroup.fromJSON(
               obj,
               data._fxEventsCollection?._fl ?? Lightshow.default._fxEventsCollection._fl,
            ),
      );
      d.customData = deepCopy(data.customData ?? Lightshow.default.customData);
      return d;
   }

   toJSON(): Required<ILightshow> {
      const json: Required<ILightshow> = {
         basicBeatmapEvents: this.basicEvents.map((obj) => obj.toJSON()),
         colorBoostBeatmapEvents: this.colorBoostEvents.map((obj) => obj.toJSON()),
         lightColorEventBoxGroups: this.lightColorEventBoxGroups.map((obj) => obj.toJSON()),
         lightRotationEventBoxGroups: this.lightRotationEventBoxGroups.map((obj) => obj.toJSON()),
         lightTranslationEventBoxGroups: this.lightTranslationEventBoxGroups.map((obj) =>
            obj.toJSON(),
         ),
         vfxEventBoxGroups: [],
         _fxEventsCollection: {
            _fl: [],
            _il: [],
         },
         customData: deepCopy(this.customData),
      };
      for (const obj of this.fxEventBoxGroups.map((obj) => obj.toJSON())) {
         json.vfxEventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            obj.object.e!.push(box.data);
            for (const evt of box.eventData) {
               box.data.l!.push(json._fxEventsCollection._fl!.length);
               json._fxEventsCollection._fl!.push(evt);
            }
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

      return this;
   }

   addWaypoints(..._: never[]): this {
      logger.tWarn(tag('addWaypoints'), 'Waypoints does not exist in lightshow V3');
      return this;
   }

   addBasicEvents(...data: Partial<IWrapEventAttribute<IBasicEvent>>[]): this;
   addBasicEvents(...data: Partial<IBasicEvent>[]): this;
   addBasicEvents(
      ...data: (Partial<IBasicEvent>[] & Partial<IWrapEventAttribute<IBasicEvent>>)[]
   ): this;
   addBasicEvents(
      ...data: (Partial<IBasicEvent>[] & Partial<IWrapEventAttribute<IBasicEvent>>)[]
   ): this {
      for (const obj of data) this.basicEvents.push(new BasicEvent(obj));
      return this;
   }

   addColorBoostEvents(...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]): this;
   addColorBoostEvents(...data: Partial<IColorBoostEvent>[]): this;
   addColorBoostEvents(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): this;
   addColorBoostEvents(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): this {
      for (const obj of data) {
         this.colorBoostEvents.push(new ColorBoostEvent(obj));
      }
      return this;
   }

   addLightColorEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      >[]
   ): this;
   addLightColorEventBoxGroups(...data: DeepPartial<ILightColorEventBoxGroup>[]): this;
   addLightColorEventBoxGroups(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         >)[]
   ): this;
   addLightColorEventBoxGroups(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         >)[]
   ): this {
      for (const obj of data) {
         this.lightColorEventBoxGroups.push(new LightColorEventBoxGroup(obj));
      }
      return this;
   }

   addLightRotationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationEvent,
            IIndexFilter
         >
      >[]
   ): this;
   addLightRotationEventBoxGroups(...data: DeepPartial<ILightRotationEventBoxGroup>[]): this;
   addLightRotationEventBoxGroups(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationEvent,
               IIndexFilter
            >
         >)[]
   ): this;
   addLightRotationEventBoxGroups(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationEvent,
               IIndexFilter
            >
         >)[]
   ): this {
      for (const obj of data) {
         this.lightRotationEventBoxGroups.push(new LightRotationEventBoxGroup(obj));
      }
      return this;
   }

   addLightTranslationEventBoxGroups(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            ILightTranslationEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationEvent,
            IIndexFilter
         >
      >[]
   ): this;
   addLightTranslationEventBoxGroups(...data: DeepPartial<ILightTranslationEventBoxGroup>[]): this;
   addLightTranslationEventBoxGroups(
      ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
         DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
               ILightTranslationEventBoxGroup,
               ILightTranslationEventBox,
               ILightTranslationEvent,
               IIndexFilter
            >
         >)[]
   ): this;
   addLightTranslationEventBoxGroups(
      ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
         DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
               ILightTranslationEventBoxGroup,
               ILightTranslationEventBox,
               ILightTranslationEvent,
               IIndexFilter
            >
         >)[]
   ): this {
      for (const obj of data) {
         this.lightTranslationEventBoxGroups.push(new LightTranslationEventBoxGroup(obj));
      }
      return this;
   }

   addFxEventBoxGroups(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>
      >[]
   ): this;
   addFxEventBoxGroups(...data: DeepPartial<IFxEventBoxGroup>[]): this;
   addFxEventBoxGroups(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>)[]
   ): this;
   addFxEventBoxGroups(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<
            IWrapFxEventBoxGroupAttribute<
               IFxEventBoxGroup,
               IFxEventBox,
               IFxEventFloat,
               IIndexFilter
            >
         >)[]
   ): this {
      for (const obj of data) {
         this.fxEventBoxGroups.push(new FxEventBoxGroup(obj));
      }
      return this;
   }

   sort(): this {
      return super.sort();
   }

   isValid(): boolean {
      return (
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
         this.fxEventBoxGroups.every((obj) => this.checkClass(FxEventBoxGroup, obj))
      );
   }
}
