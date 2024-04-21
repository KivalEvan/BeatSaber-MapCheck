import type { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords.ts';
import type { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords.ts';
import type { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords.ts';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords.ts';

/** Basic event types with keywords beatmap v3 class object. */
export class BasicEventTypesWithKeywords extends WrapEventTypesWithKeywords<
   IBasicEventTypesWithKeywords,
   IBasicEventTypesForKeywords
> {
   static default: Required<IBasicEventTypesWithKeywords> = {
      d: [],
   };

   static create(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
   ): BasicEventTypesWithKeywords {
      return new this(data);
   }

   constructor(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
   ) {
      super();
      if (data.list) {
         this._list = data.list.map((d) => new BasicEventTypesForKeywords(d));
      } else {
         this.list = BasicEventTypesWithKeywords.default.d.map((d) =>
            BasicEventTypesForKeywords.fromJSON(d),
         );
      }
   }

   static fromJSON(
      data: DeepPartial<IBasicEventTypesWithKeywords> = {},
   ): BasicEventTypesWithKeywords {
      const d = new this();
      d._list = (data.d ?? BasicEventTypesWithKeywords.default.d).map((d) =>
         BasicEventTypesForKeywords.fromJSON(d),
      );
      return d;
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

   addList(value: BasicEventTypesForKeywords): this {
      this.list.push(value);
      return this;
   }
}
