import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { IWrapIndexFilterAttribute } from '../../types/beatmap/wrapper/indexFilter.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapIndexFilter } from '../wrapper/indexFilter.ts';

/** Index filter beatmap v3 class object. */
export class IndexFilter extends WrapIndexFilter<IIndexFilter> {
   static default: Required<IIndexFilter> = {
      f: 1,
      p: 0,
      t: 0,
      r: 0,
      c: 0,
      n: 0,
      s: 0,
      l: 0,
      d: 0,
      customData: {},
   };

   static create(data: Partial<IWrapIndexFilterAttribute<IIndexFilter>> = {}): IndexFilter {
      return new IndexFilter(data);
   }

   constructor(data: Partial<IWrapIndexFilterAttribute<IIndexFilter>> = {}) {
      super();

      this._type = data.type ?? IndexFilter.default.f;
      this._p0 = data.p0 ?? IndexFilter.default.p;
      this._p1 = data.p1 ?? IndexFilter.default.t;
      this._reverse = data.reverse ?? IndexFilter.default.r;
      this._chunks = data.chunks ?? IndexFilter.default.c;
      this._random = data.random ?? IndexFilter.default.n;
      this._seed = data.seed ?? IndexFilter.default.s;
      this._limit = data.limit ?? IndexFilter.default.l;
      this._limitAffectsType = data.limitAffectsType ?? IndexFilter.default.d;
      this._customData = deepCopy(data.customData ?? IndexFilter.default.customData);
   }

   static fromJSON(data: Partial<IIndexFilter> = {}): IndexFilter {
      const d = new this();
      d._type = data.f ?? IndexFilter.default.f;
      d._p0 = data.p ?? IndexFilter.default.p;
      d._p1 = data.t ?? IndexFilter.default.t;
      d._reverse = data.r ?? IndexFilter.default.r;
      d._chunks = data.c ?? IndexFilter.default.c;
      d._random = data.n ?? IndexFilter.default.n;
      d._seed = data.s ?? IndexFilter.default.s;
      d._limit = data.l ?? IndexFilter.default.l;
      d._limitAffectsType = data.d ?? IndexFilter.default.d;
      d._customData = deepCopy(data.customData ?? IndexFilter.default.customData);
      return d;
   }

   toJSON(): Required<IIndexFilter> {
      return {
         f: this.type,
         p: this.p0,
         t: this.p1,
         r: this.reverse,
         c: this.chunks,
         n: this.random,
         s: this.seed,
         l: this.limit,
         d: this.limitAffectsType,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IIndexFilter['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IIndexFilter['customData']>) {
      this._customData = value;
   }
}
