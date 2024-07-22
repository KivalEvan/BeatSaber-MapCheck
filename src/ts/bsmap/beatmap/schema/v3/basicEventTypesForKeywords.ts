import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBasicEventTypesForKeywords } from '../../../types/beatmap/v3/basicEventTypesForKeywords.ts';
import type { IWrapBasicEventTypesForKeywordsAttribute } from '../../../types/beatmap/wrapper/basicEventTypesForKeywords.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const basicEventTypesForKeywords: ISchemaContainer<
   IWrapBasicEventTypesForKeywordsAttribute,
   IBasicEventTypesForKeywords
> = {
   serialize(data: IWrapBasicEventTypesForKeywordsAttribute): IBasicEventTypesForKeywords {
      return {
         k: data.keyword,
         e: data.events.map((e) => e),
      };
   },
   deserialize(
      data: DeepPartial<IBasicEventTypesForKeywords> = {},
   ): DeepPartial<IWrapBasicEventTypesForKeywordsAttribute> {
      return {
         keyword: data.k,
         events: data.e?.map((e) => e),
      };
   },
};
