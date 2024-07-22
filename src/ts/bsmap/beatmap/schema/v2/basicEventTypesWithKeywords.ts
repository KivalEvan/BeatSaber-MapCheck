import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ISpecialEventsKeywordFilters } from '../../../types/beatmap/v2/specialEventsKeywordFilters.ts';
import type { IWrapBasicEventTypesWithKeywordsAttribute } from '../../../types/beatmap/wrapper/mod.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { basicEventTypesForKeywords } from './basicEventTypesForKeywords.ts';

export const basicEventTypesWithKeywords: ISchemaContainer<
   IWrapBasicEventTypesWithKeywordsAttribute,
   ISpecialEventsKeywordFilters
> = {
   serialize(data: IWrapBasicEventTypesWithKeywordsAttribute): ISpecialEventsKeywordFilters {
      return {
         _keywords: data.list.map(basicEventTypesForKeywords.serialize),
      };
   },
   deserialize(
      data: DeepPartial<ISpecialEventsKeywordFilters> = {},
   ): DeepPartial<IWrapBasicEventTypesWithKeywordsAttribute> {
      return {
         list: data._keywords?.map(basicEventTypesForKeywords.deserialize),
      };
   },
};
