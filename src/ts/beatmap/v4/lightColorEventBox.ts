import type {
   ILightColorBoxContainer,
   ILightColorEventContainer,
} from '../../types/beatmap/container/v4.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { ILightColorEvent } from '../../types/beatmap/v4/lightColorEvent.ts';
import type { ILightColorEventBox } from '../../types/beatmap/v4/lightColorEventBox.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightColorEventBox } from '../wrapper/lightColorEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightColorEvent } from './lightColorEvent.ts';

/** Light color event box beatmap v4 class object. */
export class LightColorEventBox extends WrapLightColorEventBox<
   ILightColorBoxContainer,
   ILightColorEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<ILightColorBoxContainer, 'customData'> = {
      data: {
         w: 0,
         d: 1,
         s: 0,
         t: 1,
         b: 0,
         e: 0,
         customData: {},
      },
      eventData: [],
      filterData: { ...IndexFilter.default },
   };

   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxAttribute<
            ILightColorBoxContainer,
            ILightColorEventContainer,
            IIndexFilter
         >
      >[]
   ): LightColorEventBox[] {
      const result: LightColorEventBox[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxAttribute<
            ILightColorBoxContainer,
            ILightColorEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else {
         this._filter = IndexFilter.fromJSON(LightColorEventBox.default.filterData);
      }
      this._beatDistribution = data.beatDistribution ?? LightColorEventBox.default.data.w;
      this._beatDistributionType = data.beatDistributionType ?? LightColorEventBox.default.data.d;
      this._brightnessDistribution =
         data.brightnessDistribution ?? LightColorEventBox.default.data.s;
      this._brightnessDistributionType =
         data.brightnessDistributionType ?? LightColorEventBox.default.data.t;
      this._affectFirst = data.affectFirst ?? LightColorEventBox.default.data.b;
      this._easing = data.easing ?? LightColorEventBox.default.data.e;
      if (data.events) {
         this._events = data.events.map((obj) => new LightColorEvent(obj));
      } else {
         this._events = LightColorEventBox.default.eventData.map((json) =>
            LightColorEvent.fromJSON(json.data, json.time),
         );
      }
      this._customData = deepCopy(data.customData ?? LightColorEventBox.default.data.customData);
   }

   static fromJSON(
      data: Partial<ILightColorEventBox> = {},
      events?: Partial<ILightColorEvent>[],
      times?: number[],
      filter?: Partial<IIndexFilter>,
   ): LightColorEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(filter ?? LightColorEventBox.default.filterData);
      d._beatDistribution = data.w ?? LightColorEventBox.default.data.w;
      d._beatDistributionType = data.d ?? LightColorEventBox.default.data.d;
      d._brightnessDistribution = data.s ?? LightColorEventBox.default.data.s;
      d._brightnessDistributionType = data.t ?? LightColorEventBox.default.data.t;
      d._affectFirst = data.b ?? LightColorEventBox.default.data.b;
      d._easing = data.e ?? LightColorEventBox.default.data.e;
      d._events = (events! ?? LightColorEventBox.default.eventData).map((obj, i) =>
         LightColorEvent.fromJSON(obj, times?.[i]),
      );
      d._customData = deepCopy(data.customData ?? LightColorEventBox.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightColorBoxContainer> {
      return {
         data: {
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.brightnessDistribution,
            t: this.brightnessDistributionType,
            b: this.affectFirst,
            e: this.easing,
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

   get events(): LightColorEvent[] {
      return this._events as LightColorEvent[];
   }
   set events(value: LightColorEvent[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightColorEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightColorEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightColorEvent[]): this {
      this.events = value;
      return this;
   }
}
