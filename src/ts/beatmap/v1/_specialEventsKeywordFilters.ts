import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters';
import { DeepPartial } from '../../types/utils';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';

/** Dummy special event types with keywords beatmap v4 class object. */
export class SpecialEventsKeywordFilters extends WrapEventTypesWithKeywords<
   ISpecialEventsKeywordFilters,
   ISpecialEventsKeywordFiltersKeywords
> {
   static default: Required<ISpecialEventsKeywordFilters> = {
      _keywords: [],
   };

   constructor(_: DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {}) {
      super();
      this.list = [];
   }

   static create(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
   ): SpecialEventsKeywordFilters {
      return new this(data);
   }

   // deno-lint-ignore no-explicit-any
   static fromJSON(_: Record<string, any>): SpecialEventsKeywordFilters {
      return new this();
   }

   toJSON(): Required<ISpecialEventsKeywordFilters> {
      return {
         _keywords: [],
      };
   }

   get list(): never[] {
      return this._list as never[];
   }
   set list(value: never[]) {
      this._list = value;
   }

   addList(value: never) {
      this._list.push(value);
      return this;
   }
}
