import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBasicEventTypesWithKeywords } from '../../../types/beatmap/v3/basicEventTypesWithKeywords.ts';
import type { IWrapBasicEventTypesWithKeywordsAttribute } from '../../../types/beatmap/wrapper/basicEventTypesWithKeywords.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { basicEventTypesForKeywords } from './basicEventTypesForKeywords.ts';

export const basicEventTypesWithKeywords: ISchemaContainer<
   IWrapBasicEventTypesWithKeywordsAttribute,
   IBasicEventTypesWithKeywords
> = {
   serialize(
      data: IWrapBasicEventTypesWithKeywordsAttribute,
   ): Required<IBasicEventTypesWithKeywords> {
      return {
         d: data.list.map(basicEventTypesForKeywords.serialize),
      };
   },
   deserialize(
      data: DeepPartial<IBasicEventTypesWithKeywords> = {},
   ): DeepPartial<IWrapBasicEventTypesWithKeywordsAttribute> {
      return {
         list: data.d?.map(basicEventTypesForKeywords.deserialize),
      };
   },
};
