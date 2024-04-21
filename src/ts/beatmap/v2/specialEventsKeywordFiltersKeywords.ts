import type { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords.ts';
import type { IWrapEventTypesForKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesForKeywords.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { WrapEventTypesForKeywords } from '../wrapper/eventTypesForKeywords.ts';

/**
 * Special event types for keywords beatmap v2 class object.
 *
 * Used in special event types with keywords.
 */
export class SpecialEventsKeywordFiltersKeywords extends WrapEventTypesForKeywords<ISpecialEventsKeywordFiltersKeywords> {
   static default: Required<ISpecialEventsKeywordFiltersKeywords> = {
      _keyword: '',
      _specialEvents: [],
   };

   static create(
      ...data: Partial<IWrapEventTypesForKeywordsAttribute>[]
   ): SpecialEventsKeywordFiltersKeywords[] {
      const result: SpecialEventsKeywordFiltersKeywords[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: DeepPartial<IWrapEventTypesForKeywordsAttribute> = {}) {
      super();
      this._keyword = data.keyword ?? SpecialEventsKeywordFiltersKeywords.default._keyword;
      this._events = (
         data.events ?? SpecialEventsKeywordFiltersKeywords.default._specialEvents
      ).filter((n) => typeof n === 'number') as number[];
   }

   static fromJSON(
      data: DeepPartial<ISpecialEventsKeywordFiltersKeywords> = {},
   ): SpecialEventsKeywordFiltersKeywords {
      const d = new this();
      d._keyword = data._keyword ?? SpecialEventsKeywordFiltersKeywords.default._keyword;
      d._events = (
         data._specialEvents ?? SpecialEventsKeywordFiltersKeywords.default._specialEvents
      ).filter((n) => typeof n === 'number') as number[];
      return d;
   }

   toJSON(): Required<ISpecialEventsKeywordFiltersKeywords> {
      return {
         _keyword: this.keyword,
         _specialEvents: this.events,
      };
   }
}
