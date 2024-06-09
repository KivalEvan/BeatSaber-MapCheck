import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IIndexFilter } from '../../../types/beatmap/v4/indexFilter.ts';
import type { IWrapIndexFilterAttribute } from '../../../types/beatmap/wrapper/indexFilter.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
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
} as Required<IIndexFilter>;
export const indexFilter: ISchemaContainer<IWrapIndexFilterAttribute, IIndexFilter> = {
   defaultValue,
   serialize(data: IWrapIndexFilterAttribute): IIndexFilter {
      return {
         f: data.type,
         p: data.p0,
         t: data.p1,
         r: data.reverse,
         c: data.chunks,
         n: data.random,
         s: data.seed,
         l: data.limit,
         d: data.limitAffectsType,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IIndexFilter> = {}): Partial<IWrapIndexFilterAttribute> {
      return {
         type: data.f ?? defaultValue.f,
         p0: data.p ?? defaultValue.p,
         p1: data.t ?? defaultValue.t,
         reverse: data.r ?? defaultValue.r,
         chunks: data.c ?? defaultValue.c,
         random: data.n ?? defaultValue.n,
         seed: data.s ?? defaultValue.s,
         limit: data.l ?? defaultValue.l,
         limitAffectsType: data.d ?? defaultValue.d,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
