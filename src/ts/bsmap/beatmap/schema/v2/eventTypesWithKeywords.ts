import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ISpecialEventsKeywordFilters } from '../../../types/beatmap/v2/specialEventsKeywordFilters.ts';
import type { IWrapEventTypesWithKeywordsAttribute } from '../../../types/beatmap/wrapper/mod.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { eventTypesForKeywords } from './eventTypesForKeywords.ts';

const defaultValue = {
   _keywords: [],
} as Required<ISpecialEventsKeywordFilters>;
export const eventTypesWithKeywords: ISchemaContainer<
   IWrapEventTypesWithKeywordsAttribute,
   ISpecialEventsKeywordFilters
> = {
   defaultValue,
   serialize(data: IWrapEventTypesWithKeywordsAttribute): ISpecialEventsKeywordFilters {
      return {
         _keywords: data.list.map(eventTypesForKeywords.serialize),
      };
   },
   deserialize(
      data: DeepPartial<ISpecialEventsKeywordFilters> = {},
   ): DeepPartial<IWrapEventTypesWithKeywordsAttribute> {
      return {
         list: (data._keywords ?? defaultValue._keywords).map(eventTypesForKeywords.deserialize),
      };
   },
};
