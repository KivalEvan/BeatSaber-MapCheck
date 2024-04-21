import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v3/lightRotationEvent.ts';
import type { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox.ts';
import type { IWrapLightRotationEventBoxAttribute } from '../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightRotationEventBox } from '../wrapper/lightRotationEventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightRotationBase } from './lightRotationBase.ts';

/** Light rotation event box beatmap v3 class object. */
export class LightRotationEventBox extends WrapLightRotationEventBox<
   ILightRotationEventBox,
   ILightRotationEvent,
   IIndexFilter
> {
   static default: Required<ILightRotationEventBox> = {
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
         IWrapLightRotationEventBoxAttribute<
            ILightRotationEventBox,
            ILightRotationEvent,
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
            ILightRotationEventBox,
            ILightRotationEvent,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      if (data.filter) this._filter = new IndexFilter(data.filter);
      else this._filter = IndexFilter.fromJSON(LightRotationEventBox.default.f);
      this._beatDistribution = data.beatDistribution ?? LightRotationEventBox.default.w;
      this._beatDistributionType = data.beatDistributionType ?? LightRotationEventBox.default.d;
      this._rotationDistribution = data.rotationDistribution ?? LightRotationEventBox.default.s;
      this._rotationDistributionType =
         data.rotationDistributionType ?? LightRotationEventBox.default.t;
      this._axis = data.axis ?? LightRotationEventBox.default.a;
      this._flip = data.flip ?? LightRotationEventBox.default.r;
      this._affectFirst = data.affectFirst ?? LightRotationEventBox.default.b;
      this._easing = data.easing ?? LightRotationEventBox.default.i;
      if (data.events) {
         this._events = data.events.map((obj) => new LightRotationBase(obj));
      } else {
         this._events = LightRotationEventBox.default.l.map((json) =>
            LightRotationBase.fromJSON(json),
         );
      }
      this._customData = deepCopy(data.customData ?? LightRotationEventBox.default.customData);
   }

   static fromJSON(data: DeepPartial<ILightRotationEventBox> = {}): LightRotationEventBox {
      const d = new this();
      d._filter = IndexFilter.fromJSON(data.f ?? LightRotationEventBox.default.f);
      d._beatDistribution = data.w ?? LightRotationEventBox.default.w;
      d._beatDistributionType = data.d ?? LightRotationEventBox.default.d;
      d._rotationDistribution = data.s ?? LightRotationEventBox.default.s;
      d._rotationDistributionType = data.t ?? LightRotationEventBox.default.t;
      d._axis = data.a ?? LightRotationEventBox.default.a;
      d._flip = data.r ?? LightRotationEventBox.default.r;
      d._affectFirst = data.b ?? LightRotationEventBox.default.b;
      d._easing = data.i ?? LightRotationEventBox.default.i;
      d._events = (data.l ?? LightRotationEventBox.default.l).map((json) =>
         LightRotationBase.fromJSON(json),
      );
      d._customData = deepCopy(data.customData ?? LightRotationEventBox.default.customData);
      return d;
   }

   toJSON(): Required<ILightRotationEventBox> {
      return {
         f: this.filter.toJSON(),
         w: this.beatDistribution,
         d: this.beatDistributionType,
         s: this.rotationDistribution,
         t: this.rotationDistributionType,
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

   get events(): LightRotationBase[] {
      return this._events as LightRotationBase[];
   }
   set events(value: LightRotationBase[]) {
      this._events = value;
   }

   get customData(): NonNullable<ILightRotationEventBox['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationEventBox['customData']>) {
      this._customData = value;
   }

   setEvents(value: LightRotationBase[]): this {
      this.events = value;
      return this;
   }
}
