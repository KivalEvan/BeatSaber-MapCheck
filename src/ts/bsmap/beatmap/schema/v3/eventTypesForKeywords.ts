import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBasicEventTypesForKeywords } from '../../../types/beatmap/v3/basicEventTypesForKeywords.ts';
import type { IWrapEventTypesForKeywordsAttribute } from '../../../types/beatmap/wrapper/eventTypesForKeywords.ts';
import type { DeepPartial } from '../../../types/utils.ts';

const defaultValue = {
   k: '',
   e: [],
} as Required<IBasicEventTypesForKeywords>;
export const eventTypesForKeywords: ISchemaContainer<
   IWrapEventTypesForKeywordsAttribute,
   IBasicEventTypesForKeywords
> = {
   defaultValue,
   serialize(data: IWrapEventTypesForKeywordsAttribute): IBasicEventTypesForKeywords {
      return {
         k: data.keyword,
         e: data.events.map((e) => e),
      };
   },
   deserialize(
      data: DeepPartial<IBasicEventTypesForKeywords> = {},
   ): DeepPartial<IWrapEventTypesForKeywordsAttribute> {
      return {
         keyword: data.k ?? defaultValue.k,
         events: (data.e ?? defaultValue.e).map((e) => e),
      };
   },
};
