import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IWrapFxEventBoxAttribute } from '../../types/beatmap/wrapper/fxEventBox';
import { DeepPartial } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapFxEventBox } from '../wrapper/fxEventBox';
import { IndexFilter } from './indexFilter';

/** FX event box beatmap v3 class object. */
export class FxEventBox extends WrapFxEventBox<IFxEventBox, IIndexFilter> {
   static default: Required<IFxEventBox> = {
      f: {
         f: IndexFilter.default.f,
         p: IndexFilter.default.p,
         t: IndexFilter.default.t,
         r: IndexFilter.default.r,
         c: IndexFilter.default.c,
         n: IndexFilter.default.n,
         s: IndexFilter.default.s,
         l: IndexFilter.default.l,
         d: IndexFilter.default.d,
      },
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      b: 0,
      i: 0,
      l: [],
      customData: {},
   };

   constructor();
   constructor(data: DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>>);
   constructor(data: DeepPartial<IFxEventBox>);
   constructor(
      data: DeepPartial<IFxEventBox> &
         DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>>,
   );
   constructor(
      data: DeepPartial<IFxEventBox> &
         DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>> = {},
   ) {
      super();

      this._filter = new IndexFilter(
         (data as IFxEventBox).f ?? (data.filter as IIndexFilter) ?? FxEventBox.default.f,
      );
      this._beatDistribution = data.w ?? data.beatDistribution ?? FxEventBox.default.w;
      this._beatDistributionType = data.d ?? data.beatDistributionType ?? FxEventBox.default.d;
      this._fxDistribution = data.s ?? data.fxDistribution ?? FxEventBox.default.s;
      this._fxDistributionType = data.t ?? data.fxDistributionType ?? FxEventBox.default.t;
      this._affectFirst = data.b ?? data.affectFirst ?? FxEventBox.default.b;
      this._easing = data.i ?? data.easing ?? FxEventBox.default.i;
      this._events = (
         (data as IFxEventBox).l ??
         (data.events as number[]) ??
         FxEventBox.default.l
      ).map((obj) => obj);
      this._customData = deepCopy(data.customData ?? FxEventBox.default.customData);
   }

   static create(): FxEventBox[];
   static create(
      ...data: DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>>[]
   ): FxEventBox[];
   static create(...data: DeepPartial<IFxEventBox>[]): FxEventBox[];
   static create(
      ...data: (DeepPartial<IFxEventBox> &
         DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>>)[]
   ): FxEventBox[];
   static create(
      ...data: (DeepPartial<IFxEventBox> &
         DeepPartial<IWrapFxEventBoxAttribute<IFxEventBox, IIndexFilter>>)[]
   ): FxEventBox[] {
      const result: FxEventBox[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IFxEventBox {
      return {
         f: this.filter.toJSON(),
         w: this.beatDistribution,
         d: this.beatDistributionType,
         s: this.fxDistribution,
         t: this.fxDistributionType,
         b: this.affectFirst,
         i: this.easing,
         l: this.events.map((l) => l),
         customData: deepCopy(this.customData),
      };
   }

   get filter(): IndexFilter {
      return this._filter as IndexFilter;
   }
   set filter(value: IndexFilter) {
      this._filter = value;
   }

   get events(): number[] {
      return this._events as number[];
   }
   set events(value: number[]) {
      this._events = value;
   }

   get customData(): NonNullable<IFxEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: number[]): this {
      this.events = value;
      return this;
   }
}
