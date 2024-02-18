import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IWrapEventTypesForKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { DeepPartial } from '../../types/utils';
import { WrapEventTypesForKeywords } from '../wrapper/eventTypesForKeywords';

/**
 * Basic event types for keywords beatmap v3 class object.
 *
 * Used in basic event types with keywords.
 */
export class BasicEventTypesForKeywords extends WrapEventTypesForKeywords<IBasicEventTypesForKeywords> {
   static default: Required<IBasicEventTypesForKeywords> = {
      k: '',
      e: [],
   };

   static create(
      ...data: Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>[]
   ): BasicEventTypesForKeywords[] {
      const result: BasicEventTypesForKeywords[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>> = {},
   ) {
      super();
      this._keyword = data.keyword ?? BasicEventTypesForKeywords.default.k;
      this._events = (data.events ?? BasicEventTypesForKeywords.default.e).filter(
         (n) => typeof n === 'number',
      ) as number[];
   }

   static fromJSON(data: DeepPartial<IBasicEventTypesForKeywords>): BasicEventTypesForKeywords {
      const d = new this();
      d._keyword = data.k ?? BasicEventTypesForKeywords.default.k;
      d._events = (data.e ?? BasicEventTypesForKeywords.default.e).filter(
         (n) => typeof n === 'number',
      ) as number[];
      return d;
   }

   toJSON(): Required<IBasicEventTypesForKeywords> {
      return {
         k: this.keyword,
         e: this.events,
      };
   }
}
