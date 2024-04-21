import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { ILightColorEvent } from '../../types/beatmap/v3/lightColorEvent.ts';
import type { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox.ts';
import type { IWrapLightColorEventBoxAttribute } from '../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightColorEventBox } from '../wrapper/lightColorEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightColorBase } from './lightColorBase.ts';

/** Light color event box beatmap v3 class object. */
export class LightColorEventBox extends WrapLightColorEventBox<
   ILightColorEventBox,
   ILightColorEvent,
   IIndexFilter
> {
   static default: Required<ILightColorEventBox> = {
      f: { ...IndexFilter.default },
      w: 0,
      d: 1,
      r: 0,
      t: 1,
      b: 0,
      i: 0,
      e: [],
      customData: {},
   };

   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorEvent, IIndexFilter>
      >[]
   ): LightColorEventBox[] {
      const result: LightColorEventBox[] = data.map((eb) => new this(eb));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxAttribute<ILightColorEventBox, ILightColorEvent, IIndexFilter>
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else this._filter = IndexFilter.fromJSON(LightColorEventBox.default.f);
      this._beatDistribution = data.beatDistribution ?? LightColorEventBox.default.w;
      this._beatDistributionType = data.beatDistributionType ?? LightColorEventBox.default.d;
      this._brightnessDistribution = data.brightnessDistribution ?? LightColorEventBox.default.r;
      this._brightnessDistributionType =
         data.brightnessDistributionType ?? LightColorEventBox.default.t;
      this._affectFirst = data.affectFirst ?? LightColorEventBox.default.b;
      this._easing = data.easing ?? LightColorEventBox.default.i;
      if (data.events) {
         this._events = data.events.map((obj) => new LightColorBase(obj));
      } else {
         this._events = LightColorEventBox.default.e.map((json) => LightColorBase.fromJSON(json));
      }
      this._customData = deepCopy(data.customData ?? LightColorEventBox.default.customData);
   }

   static fromJSON(data: DeepPartial<ILightColorEventBox> = {}): LightColorEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(data.f ?? LightColorEventBox.default.f);
      d._beatDistribution = data.w ?? LightColorEventBox.default.w;
      d._beatDistributionType = data.d ?? LightColorEventBox.default.d;
      d._brightnessDistribution = data.r ?? LightColorEventBox.default.r;
      d._brightnessDistributionType = data.t ?? LightColorEventBox.default.t;
      d._affectFirst = data.b ?? LightColorEventBox.default.b;
      d._easing = data.i ?? LightColorEventBox.default.i;
      d._events = (data.e ?? LightColorEventBox.default.e).map((json) =>
         LightColorBase.fromJSON(json),
      );
      d._customData = deepCopy(data.customData ?? LightColorEventBox.default.customData);
      return d;
   }

   toJSON(): Required<ILightColorEventBox> {
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
