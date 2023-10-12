import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { IWrapIndexFilterAttribute } from '../../types/beatmap/wrapper/indexFilter';
import { deepCopy } from '../../utils/misc';
import { WrapIndexFilter } from '../wrapper/indexFilter';

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

   constructor();
   constructor(data: Partial<IWrapIndexFilterAttribute<IIndexFilter>>);
   constructor(data: Partial<IIndexFilter>);
   constructor(data: Partial<IIndexFilter> & Partial<IWrapIndexFilterAttribute<IIndexFilter>>);
   constructor(
      data: Partial<IIndexFilter> & Partial<IWrapIndexFilterAttribute<IIndexFilter>> = {},
   ) {
      super();

      this._type = data.f ?? data.type ?? IndexFilter.default.f;
      this._p0 = data.p ?? data.p0 ?? IndexFilter.default.p;
      this._p1 = data.t ?? data.p1 ?? IndexFilter.default.t;
      this._reverse = data.r ?? data.reverse ?? IndexFilter.default.r;
      this._chunks = data.c ?? data.chunks ?? IndexFilter.default.c;
      this._random = data.n ?? data.random ?? IndexFilter.default.n;
      this._seed = data.s ?? data.seed ?? IndexFilter.default.s;
      this._limit = data.l ?? data.limit ?? IndexFilter.default.l;
      this._limitAffectsType = data.d ?? data.limitAffectsType ?? IndexFilter.default.d;
      this._customData = deepCopy(data.customData ?? IndexFilter.default.customData);
   }

   static create(): IndexFilter;
   static create(data: Partial<IWrapIndexFilterAttribute<IIndexFilter>>): IndexFilter;
   static create(data: Partial<IIndexFilter>): IndexFilter;
   static create(
      data: Partial<IIndexFilter> & Partial<IWrapIndexFilterAttribute<IIndexFilter>>,
   ): IndexFilter;
   static create(
      data: Partial<IIndexFilter> & Partial<IWrapIndexFilterAttribute<IIndexFilter>> = {},
   ): IndexFilter {
      return new IndexFilter(data);
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
