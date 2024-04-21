import type {
   ILightRotationBoxContainer,
   ILightRotationEventContainer,
} from '../../types/beatmap/container/v4.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v4/lightRotationEvent.ts';
import type { ILightRotationEventBox } from '../../types/beatmap/v4/lightRotationEventBox.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightRotationEventBox } from '../wrapper/lightRotationEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightRotationEvent } from './lightRotationEvent.ts';

/** Light rotation event box beatmap v4 class object. */
export class LightRotationEventBox extends WrapLightRotationEventBox<
   ILightRotationBoxContainer,
   ILightRotationEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<ILightRotationBoxContainer, 'customData'> = {
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
         IWrapLightRotationEventBoxAttribute<
            ILightRotationBoxContainer,
            ILightRotationEventContainer,
            IIndexFilter
         >
      >[]
   ): LightRotationEventBox[] {
      const result: LightRotationEventBox[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightRotationEventBoxAttribute<
            ILightRotationBoxContainer,
            ILightRotationEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else {
         this._filter = IndexFilter.fromJSON(LightRotationEventBox.default.filterData);
      }
      this._beatDistribution = data.beatDistribution ?? LightRotationEventBox.default.data.w;
      this._beatDistributionType =
         data.beatDistributionType ?? LightRotationEventBox.default.data.d;
      this._rotationDistribution =
         data.rotationDistribution ?? LightRotationEventBox.default.data.s;
      this._rotationDistributionType =
         data.rotationDistributionType ?? LightRotationEventBox.default.data.t;
      this._affectFirst = data.affectFirst ?? LightRotationEventBox.default.data.b;
      this._easing = data.easing ?? LightRotationEventBox.default.data.e;
      this._axis = data.axis ?? LightRotationEventBox.default.data.a;
      this._flip = data.flip ?? LightRotationEventBox.default.data.f;
      if (data.events) {
         this._events = data.events.map((obj) => new LightRotationEvent(obj));
      } else {
         this._events = LightRotationEventBox.default.eventData.map((json) =>
            LightRotationEvent.fromJSON(json.data, json.time),
         );
      }
      this._customData = deepCopy(data.customData ?? LightRotationEventBox.default.data.customData);
   }

   static fromJSON(
      data: Partial<ILightRotationEventBox> = {},
      events?: Partial<ILightRotationEvent>[],
      times?: number[],
      filter?: Partial<IIndexFilter>,
   ): LightRotationEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(filter ?? LightRotationEventBox.default.filterData);
      d._beatDistribution = data.w ?? LightRotationEventBox.default.data.w;
      d._beatDistributionType = data.d ?? LightRotationEventBox.default.data.d;
      d._rotationDistribution = data.s ?? LightRotationEventBox.default.data.s;
      d._rotationDistributionType = data.t ?? LightRotationEventBox.default.data.t;
      d._affectFirst = data.b ?? LightRotationEventBox.default.data.b;
      d._easing = data.e ?? LightRotationEventBox.default.data.e;
      d._axis = data.a ?? LightRotationEventBox.default.data.a;
      d._flip = data.f ?? LightRotationEventBox.default.data.f;
      d._events = (events! ?? LightRotationEventBox.default.eventData).map((obj, i) =>
         LightRotationEvent.fromJSON(obj, times?.[i]),
      );
      d._customData = deepCopy(data.customData ?? LightRotationEventBox.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightRotationBoxContainer> {
      return {
         data: {
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.rotationDistribution,
            t: this.rotationDistributionType,
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

   get events(): LightRotationEvent[] {
      return this._events as LightRotationEvent[];
   }
   set events(value: LightRotationEvent[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightRotationEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightRotationEvent[]): this {
      this.events = value;
      return this;
   }
}
