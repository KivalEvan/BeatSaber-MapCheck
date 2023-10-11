import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { DeepPartial } from '../../types/utils';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords';

/** Basic event types with keywords beatmap v3 class object. */
export class BasicEventTypesWithKeywords extends WrapEventTypesWithKeywords<
   IBasicEventTypesWithKeywords,
   IBasicEventTypesForKeywords
> {
   static default: Required<IBasicEventTypesWithKeywords> = {
      d: [],
   };

   constructor();
   constructor(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
   );
   constructor(data: DeepPartial<IBasicEventTypesWithKeywords>);
   constructor(
      data: DeepPartial<IBasicEventTypesWithKeywords> &
         DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
   );
   constructor(
      data: DeepPartial<IBasicEventTypesWithKeywords> &
         DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
   ) {
      super();

      this._list = (data.d ?? data.list ?? BasicEventTypesWithKeywords.default.d)
         .map((d) => {
            if (d) return new BasicEventTypesForKeywords(d);
            return;
         })
         .filter((d) => d) as BasicEventTypesForKeywords[];
   }

   static create(): BasicEventTypesWithKeywords;
   static create(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
   ): BasicEventTypesWithKeywords;
   static create(data: DeepPartial<IBasicEventTypesWithKeywords>): BasicEventTypesWithKeywords;
   static create(
      data: DeepPartial<IBasicEventTypesWithKeywords> &
         DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
   ): BasicEventTypesWithKeywords;
   static create(
      data: DeepPartial<IBasicEventTypesWithKeywords> &
         DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
   ): BasicEventTypesWithKeywords {
      return new this(data);
   }

   toJSON(): Required<IBasicEventTypesWithKeywords> {
      return {
         d: this.list.map((d) => d.toJSON()),
      };
   }

   get list(): BasicEventTypesForKeywords[] {
      return this._list as BasicEventTypesForKeywords[];
   }
   set list(value: BasicEventTypesForKeywords[]) {
      this._list = value;
   }

   addList(value: BasicEventTypesForKeywords) {
      this.list.push(value);
      return this;
   }
}
