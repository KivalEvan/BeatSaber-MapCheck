import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ISpecialEventsKeywordFiltersKeywords } from '../../../types/beatmap/v2/specialEventsKeywordFiltersKeywords.ts';
import type { IWrapEventTypesForKeywordsAttribute } from '../../../types/beatmap/wrapper/eventTypesForKeywords.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const eventTypesForKeywords: ISchemaContainer<
   IWrapEventTypesForKeywordsAttribute,
   ISpecialEventsKeywordFiltersKeywords
> = {
   serialize(data: IWrapEventTypesForKeywordsAttribute): ISpecialEventsKeywordFiltersKeywords {
      return {
         _keyword: data.keyword,
         _specialEvents: data.events,
      };
   },
   deserialize(
      data: DeepPartial<ISpecialEventsKeywordFiltersKeywords> = {},
   ): DeepPartial<IWrapEventTypesForKeywordsAttribute> {
      return {
         keyword: data._keyword,
         events: data._specialEvents,
      };
   },
};
