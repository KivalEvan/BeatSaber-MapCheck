import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { IWrapLightColorEventBoxAttribute } from '../../types/beatmap/wrapper/lightColorEventBox';
import { DeepPartial } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorEventBox } from '../wrapper/lightColorEventBox';
import { IndexFilter } from './indexFilter';
import { LightColorBase } from './lightColorBase';

/** Light color event box beatmap v3 class object. */
export class LightColorEventBox extends WrapLightColorEventBox<
   ILightColorEventBox,
   ILightColorBase,
   IIndexFilter
> {
   static default: Required<ILightColorEventBox> = {
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
      r: 0,
      t: 1,
      b: 0,
      i: 0,
      e: [],
      customData: {},
   };

   constructor();
   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
      >,
   );
   constructor(data: DeepPartial<ILightColorEventBox>);
   constructor(
      data: DeepPartial<ILightColorEventBox> &
         DeepPartial<
            IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
         >,
   );
   constructor(
      data: DeepPartial<ILightColorEventBox> &
         DeepPartial<
            IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
         > = {},
   ) {
      super();

      this._filter = new IndexFilter(
         (data as ILightColorEventBox).f ??
            (data.filter as IIndexFilter) ??
            LightColorEventBox.default.f,
      );
      this._beatDistribution = data.w ?? data.beatDistribution ?? LightColorEventBox.default.w;
      this._beatDistributionType =
         data.d ?? data.beatDistributionType ?? LightColorEventBox.default.d;
      this._brightnessDistribution =
         data.r ?? data.brightnessDistribution ?? LightColorEventBox.default.r;
      this._brightnessDistributionType =
         data.t ?? data.brightnessDistributionType ?? LightColorEventBox.default.t;
      this._affectFirst = data.b ?? data.affectFirst ?? LightColorEventBox.default.b;
      this._easing = data.i ?? data.easing ?? LightColorEventBox.default.i;
      this._events = (
         (data as ILightColorEventBox).e ??
         (data.events as ILightColorBase[]) ??
         LightColorEventBox.default.e
      ).map((obj) => new LightColorBase(obj));
      this._customData = deepCopy(data.customData ?? LightColorEventBox.default.customData);
   }

   static create(): LightColorEventBox[];
   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
      >[]
   ): LightColorEventBox[];
   static create(...data: DeepPartial<ILightColorEventBox>[]): LightColorEventBox[];
   static create(
      ...data: (DeepPartial<ILightColorEventBox> &
         DeepPartial<
            IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
         >)[]
   ): LightColorEventBox[];
   static create(
      ...data: (DeepPartial<ILightColorEventBox> &
         DeepPartial<
            IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorBase, IIndexFilter>
         >)[]
   ): LightColorEventBox[] {
      const result: LightColorEventBox[] = [];
      data.forEach((eb) => result.push(new this(eb)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): ILightColorEventBox {
      return {
         f: this.filter.toJSON(),
         w: this.beatDistribution,
         d: this.beatDistributionType,
         r: this.brightnessDistribution,
         t: this.brightnessDistributionType,
         b: this.affectFirst,
         i: this.easing,
         e: this.events.map((e) => e.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get filter(): IndexFilter {
      return this._filter as IndexFilter;
   }
   set filter(value: IndexFilter) {
      this._filter = value;
   }

   get events(): LightColorBase[] {
      return this._events as LightColorBase[];
   }
   set events(value: LightColorBase[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightColorEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightColorEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightColorBase[]): this {
      this.events = value;
      return this;
   }
}
