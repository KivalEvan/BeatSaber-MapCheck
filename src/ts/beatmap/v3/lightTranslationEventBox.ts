import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { ILightTranslationEvent } from '../../types/beatmap/v3/lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox.ts';
import type { IWrapLightTranslationEventBoxAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightTranslationEventBox } from '../wrapper/lightTranslationEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightTranslationBase } from './lightTranslationBase.ts';

/** Light translation event box beatmap v3 class object. */
export class LightTranslationEventBox extends WrapLightTranslationEventBox<
   ILightTranslationEventBox,
   ILightTranslationEvent,
   IIndexFilter
> {
   static default: Required<ILightTranslationEventBox> = {
      f: { ...IndexFilter.default },
      w: 0,
      d: 1,
      s: 0,
      t: 1,
      a: 0,
      r: 0,
      b: 0,
      i: 0,
      l: [],
      customData: {},
   };

   static create(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxAttribute<
            ILightTranslationEventBox,
            ILightTranslationEvent,
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
            ILightTranslationEventBox,
            ILightTranslationEvent,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else {
         this._filter = IndexFilter.fromJSON(LightTranslationEventBox.default.f);
      }
      this._beatDistribution = data.beatDistribution ?? LightTranslationEventBox.default.w;
      this._beatDistributionType = data.beatDistributionType ?? LightTranslationEventBox.default.d;
      this._translationDistribution = data.gapDistribution ?? LightTranslationEventBox.default.s;
      this._translationDistributionType =
         data.gapDistributionType ?? LightTranslationEventBox.default.t;
      this._axis = data.axis ?? LightTranslationEventBox.default.a;
      this._flip = data.flip ?? LightTranslationEventBox.default.r;
      this._affectFirst = data.affectFirst ?? LightTranslationEventBox.default.b;
      this._easing = data.easing ?? LightTranslationEventBox.default.i;
      if (data.events) {
         this._events = data.events.map((obj) => new LightTranslationBase(obj));
      } else {
         this._events = LightTranslationEventBox.default.l.map((json) =>
            LightTranslationBase.fromJSON(json),
         );
      }
      this._customData = deepCopy(data.customData ?? LightTranslationEventBox.default.customData);
   }

   static fromJSON(data: DeepPartial<ILightTranslationEventBox> = {}): LightTranslationEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(data.f ?? LightTranslationEventBox.default.f);
      d._beatDistribution = data.w ?? LightTranslationEventBox.default.w;
      d._beatDistributionType = data.d ?? LightTranslationEventBox.default.d;
      d._translationDistribution = data.s ?? LightTranslationEventBox.default.s;
      d._translationDistributionType = data.t ?? LightTranslationEventBox.default.t;
      d._axis = data.a ?? LightTranslationEventBox.default.a;
      d._flip = data.r ?? LightTranslationEventBox.default.r;
      d._affectFirst = data.b ?? LightTranslationEventBox.default.b;
      d._easing = data.i ?? LightTranslationEventBox.default.i;
      d._events = (data.l ?? LightTranslationEventBox.default.l).map((obj) =>
         LightTranslationBase.fromJSON(obj),
      );
      d._customData = deepCopy(data.customData ?? LightTranslationEventBox.default.customData);
      return d;
   }

   toJSON(): Required<ILightTranslationEventBox> {
      return {
         f: this.filter.toJSON(),
         w: this.beatDistribution,
         d: this.beatDistributionType,
         s: this.gapDistribution,
         t: this.gapDistributionType,
         a: this.axis,
         r: this.flip,
         b: this.affectFirst,
         i: this.easing,
         l: this.events.map((l) => l.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get filter(): IndexFilter {
      return this._filter as IndexFilter;
   }
   set filter(value: IndexFilter) {
      this._filter = value;
   }

   get events(): LightTranslationBase[] {
      return this._events as LightTranslationBase[];
   }
   set events(value: LightTranslationBase[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightTranslationEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightTranslationBase[]): this {
      this.events = value;
      return this;
   }
}
