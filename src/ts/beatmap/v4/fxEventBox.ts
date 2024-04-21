import type {
   IFxEventFloatBoxContainer,
   IFxEventFloatContainer,
} from '../../types/beatmap/container/v4.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { IFxEventFloat } from '../../types/beatmap/v4/fxEventFloat.ts';
import type { IFxEventBox } from '../../types/beatmap/v4/fxEventBox.ts';
import type { IWrapFxEventBoxAttribute } from '../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapFxEventBox } from '../wrapper/fxEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { FxEventFloat } from './fxEventFloat.ts';

/** Fx event box beatmap v4 class object. */
export class FxEventBox extends WrapFxEventBox<
   IFxEventFloatBoxContainer,
   IFxEventFloatContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<IFxEventFloatBoxContainer, 'customData'> = {
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
         IWrapFxEventBoxAttribute<IFxEventFloatBoxContainer, IFxEventFloatContainer, IIndexFilter>
      >[]
   ): FxEventBox[] {
      const result: FxEventBox[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapFxEventBoxAttribute<IFxEventFloatBoxContainer, IFxEventFloatContainer, IIndexFilter>
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else this._filter = IndexFilter.fromJSON(FxEventBox.default.filterData);
      this._beatDistribution = data.beatDistribution ?? FxEventBox.default.data.w;
      this._beatDistributionType = data.beatDistributionType ?? FxEventBox.default.data.d;
      this._fxDistribution = data.fxDistribution ?? FxEventBox.default.data.s;
      this._fxDistributionType = data.fxDistributionType ?? FxEventBox.default.data.t;
      this._affectFirst = data.affectFirst ?? FxEventBox.default.data.b;
      this._easing = data.easing ?? FxEventBox.default.data.e;
      if (data.events) {
         this._events = data.events.map((obj) => new FxEventFloat(obj));
      } else {
         this._events = FxEventBox.default.eventData.map((json) =>
            FxEventFloat.fromJSON(json.data, json.time),
         );
      }
      this._customData = deepCopy(data.customData ?? FxEventBox.default.data.customData);
   }

   static fromJSON(
      data: Partial<IFxEventBox> = {},
      events?: Partial<IFxEventFloat>[],
      times?: number[],
      filter?: Partial<IIndexFilter>,
   ): FxEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(filter ?? FxEventBox.default.filterData);
      d._beatDistribution = data.w ?? FxEventBox.default.data.w;
      d._beatDistributionType = data.d ?? FxEventBox.default.data.d;
      d._fxDistribution = data.s ?? FxEventBox.default.data.s;
      d._fxDistributionType = data.t ?? FxEventBox.default.data.t;
      d._affectFirst = data.b ?? FxEventBox.default.data.b;
      d._easing = data.e ?? FxEventBox.default.data.e;
      d._events = (events! ?? FxEventBox.default.eventData).map((obj, i) =>
         FxEventFloat.fromJSON(obj, times?.[i]),
      );
      d._customData = deepCopy(data.customData ?? FxEventBox.default.data.customData);
      return d;
   }

   toJSON(): Required<IFxEventFloatBoxContainer> {
      return {
         data: {
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.fxDistribution,
            t: this.fxDistributionType,
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

   get events(): FxEventFloat[] {
      return this._events as FxEventFloat[];
   }
   set events(value: FxEventFloat[]) {
      this._events = value;
   }

   get customData(): NonNullable<IFxEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: FxEventFloat[]): this {
      this.events = value;
      return this;
   }
}
