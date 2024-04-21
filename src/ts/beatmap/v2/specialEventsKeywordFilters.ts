import type { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { SpecialEventsKeywordFiltersKeywords } from './specialEventsKeywordFiltersKeywords.ts';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords.ts';
import type { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords.ts';
import type { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords.ts';

/** Special event types with keywords beatmap v2 class object. */
export class SpecialEventsKeywordFilters extends WrapEventTypesWithKeywords<
   ISpecialEventsKeywordFilters,
   ISpecialEventsKeywordFiltersKeywords
> {
   static default: Required<ISpecialEventsKeywordFilters> = {
      _keywords: [],
   };

   static create(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
   ): SpecialEventsKeywordFilters {
      return new this(data);
   }

   constructor(data: DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {}) {
      super();
      if (data.list) {
         this._list = data.list.map((d) => new SpecialEventsKeywordFiltersKeywords(d));
      } else {
         this._list = SpecialEventsKeywordFilters.default._keywords.map((json) =>
            SpecialEventsKeywordFiltersKeywords.fromJSON(json),
         );
      }
   }

   static fromJSON(
      data: DeepPartial<ISpecialEventsKeywordFilters> = {},
   ): SpecialEventsKeywordFilters {
      const d = new this();
      d._list = (data._keywords ?? SpecialEventsKeywordFilters.default._keywords).map((json) =>
         SpecialEventsKeywordFiltersKeywords.fromJSON(json),
      );
      return d;
   }

   toJSON(): Required<ISpecialEventsKeywordFilters> {
      return {
         _keywords: this.list.map((d) => d.toJSON()),
      };
   }

   get list(): SpecialEventsKeywordFiltersKeywords[] {
      return this._list as SpecialEventsKeywordFiltersKeywords[];
   }
   set list(value: SpecialEventsKeywordFiltersKeywords[]) {
      this._list = value;
   }

   addList(value: SpecialEventsKeywordFiltersKeywords): this {
      this._list.push(value);
      return this;
   }
}
