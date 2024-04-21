import type {
   ILightTranslationBoxContainer,
   ILightTranslationEventContainer,
} from '../../types/beatmap/container/v4.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { ILightTranslationEvent } from '../../types/beatmap/v4/lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from '../../types/beatmap/v4/lightTranslationEventBox.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightTranslationEventBox } from '../wrapper/lightTranslationEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightTranslationEvent } from './lightTranslationEvent.ts';

/** Light translation event box beatmap v4 class object. */
export class LightTranslationEventBox extends WrapLightTranslationEventBox<
   ILightTranslationBoxContainer,
   ILightTranslationEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<ILightTranslationBoxContainer, 'customData'> = {
      data: {
         w: 0,
         d: 1,
         s: 0,
         t: 1,
         b: 0,
         e: 0,
         f: 0,
         a: 0,
         customData: {},
      },
      eventData: [],
      filterData: { ...IndexFilter.default },
   };

   static create(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxAttribute<
            ILightTranslationBoxContainer,
            ILightTranslationEventContainer,
            IIndexFilter
         >
      >[]
   ): LightTranslationEventBox[] {
      const result: LightTranslationEventBox[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightTranslationEventBoxAttribute<
            ILightTranslationBoxContainer,
            ILightTranslationEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else {
         this._filter = IndexFilter.fromJSON(LightTranslationEventBox.default.filterData);
      }
      this._beatDistribution = data.beatDistribution ?? LightTranslationEventBox.default.data.w;
      this._beatDistributionType =
         data.beatDistributionType ?? LightTranslationEventBox.default.data.d;
      this._translationDistribution =
         data.gapDistribution ?? LightTranslationEventBox.default.data.s;
      this._translationDistributionType =
         data.gapDistributionType ?? LightTranslationEventBox.default.data.t;
      this._affectFirst = data.affectFirst ?? LightTranslationEventBox.default.data.b;
      this._easing = data.easing ?? LightTranslationEventBox.default.data.e;
      this._axis = data.axis ?? LightTranslationEventBox.default.data.a;
      this._flip = data.flip ?? LightTranslationEventBox.default.data.f;
      if (data.events) {
         this._events = data.events.map((obj) => new LightTranslationEvent(obj));
      } else {
         this._events = LightTranslationEventBox.default.eventData.map((json) =>
            LightTranslationEvent.fromJSON(json.data, json.time),
         );
      }
      this._customData = deepCopy(
         data.customData ?? LightTranslationEventBox.default.data.customData,
      );
   }

   static fromJSON(
      data: Partial<ILightTranslationEventBox> = {},
      events?: Partial<ILightTranslationEvent>[],
      times?: number[],
      filter?: Partial<IIndexFilter>,
   ): LightTranslationEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(filter ?? LightTranslationEventBox.default.filterData);
      d._beatDistribution = data.w ?? LightTranslationEventBox.default.data.w;
      d._beatDistributionType = data.d ?? LightTranslationEventBox.default.data.d;
      d._translationDistribution = data.s ?? LightTranslationEventBox.default.data.s;
      d._translationDistributionType = data.t ?? LightTranslationEventBox.default.data.t;
      d._affectFirst = data.b ?? LightTranslationEventBox.default.data.b;
      d._easing = data.e ?? LightTranslationEventBox.default.data.e;
      d._axis = data.a ?? LightTranslationEventBox.default.data.a;
      d._flip = data.f ?? LightTranslationEventBox.default.data.f;
      d._events = (events! ?? LightTranslationEventBox.default.eventData).map((obj, i) =>
         LightTranslationEvent.fromJSON(obj, times?.[i]),
      );
      d._customData = deepCopy(data.customData ?? LightTranslationEventBox.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightTranslationBoxContainer> {
      return {
         data: {
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.gapDistribution,
            t: this.gapDistributionType,
            b: this.affectFirst,
            e: this.easing,
            a: this.axis,
            f: this.flip,
            customData: deepCopy(this.customData),
         },
         eventData: this.events.map((e) => e.toJSON()),
         filterData: this.filter.toJSON(),
      };
   }

   get filter(): IndexFilter {
      return this._filter as IndexFilter;
   }
   set filter(value: IndexFilter) {
      this._filter = value;
   }

   get events(): LightTranslationEvent[] {
      return this._events as LightTranslationEvent[];
   }
   set events(value: LightTranslationEvent[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightTranslationEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightTranslationEvent[]): this {
      this.events = value;
      return this;
   }
}
