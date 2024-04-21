import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { IFxEventBox } from '../../types/beatmap/v3/fxEventBox.ts';
import type { IWrapFxEventBoxAttribute } from '../../types/beatmap/wrapper/fxEventBox.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapFxEventBox } from '../wrapper/fxEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import type { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat.ts';
import { FxEventFloat } from './fxEventFloat.ts';
import type { IFxEventFloatBoxContainer } from '../../types/beatmap/container/v3.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';

/** FX event box beatmap v3 class object. */
export class FxEventBox extends WrapFxEventBox<
   IFxEventFloatBoxContainer,
   IFxEventFloat,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<IFxEventFloatBoxContainer, 'customData'> = {
      data: {
         f: { ...IndexFilter.default },
         w: 0,
         d: 1,
         s: 0,
         t: 1,
         b: 0,
         i: 0,
         l: [],
         customData: {},
      },
      eventData: [],
   };

   static create(
      ...data: DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IFxEventFloat, IIndexFilter>>[]
   ): FxEventBox[] {
      const result: FxEventBox[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapFxEventBoxAttribute<IFxEventFloatBoxContainer, IFxEventFloat, IIndexFilter>
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else this._filter = IndexFilter.fromJSON(FxEventBox.default.data.f);
      this._beatDistribution = data.beatDistribution ?? FxEventBox.default.data.w;
      this._beatDistributionType = data.beatDistributionType ?? FxEventBox.default.data.d;
      this._fxDistribution = data.fxDistribution ?? FxEventBox.default.data.s;
      this._fxDistributionType = data.fxDistributionType ?? FxEventBox.default.data.t;
      this._affectFirst = data.affectFirst ?? FxEventBox.default.data.b;
      this._easing = data.easing ?? FxEventBox.default.data.i;
      if (data.events) {
         this._events = data.events.map((obj) => new FxEventFloat(obj));
      } else {
         this._events = FxEventBox.default.eventData.map((json) => FxEventFloat.fromJSON(json));
      }
      this._customData = deepCopy(data.customData ?? FxEventBox.default.data.customData);
   }

   static fromJSON(
      data: DeepPartial<IFxEventBox> = {},
      events?: Partial<IFxEventFloat>[],
   ): FxEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(data.f ?? FxEventBox.default.data.f);
      d._beatDistribution = data.w ?? FxEventBox.default.data.w;
      d._beatDistributionType = data.d ?? FxEventBox.default.data.d;
      d._fxDistribution = data.s ?? FxEventBox.default.data.s;
      d._fxDistributionType = data.t ?? FxEventBox.default.data.t;
      d._affectFirst = data.b ?? FxEventBox.default.data.b;
      d._easing = data.i ?? FxEventBox.default.data.i;
      d._events = [];
      if (events) {
         for (const n of data.l || []) {
            d._events.push(FxEventFloat.fromJSON(events[n]));
         }
      } else {
         d._events = FxEventBox.default.eventData.map((json) => FxEventFloat.fromJSON(json));
      }
      d._customData = deepCopy(data.customData ?? FxEventBox.default.data.customData);
      return d;
   }

   toJSON(): Required<IFxEventFloatBoxContainer> {
      return {
         data: {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.fxDistribution,
            t: this.fxDistributionType,
            b: this.affectFirst,
            i: this.easing,
            l: [],
            customData: deepCopy(this.customData),
         },
         eventData: this.events.map((l) => l.toJSON()),
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
