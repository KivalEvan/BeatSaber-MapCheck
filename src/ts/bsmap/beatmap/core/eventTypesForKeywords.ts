import type {
   IWrapEventTypesForKeywords,
   IWrapEventTypesForKeywordsAttribute,
} from '../../types/beatmap/wrapper/eventTypesForKeywords.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { BaseItem } from './abstract/baseItem.ts';

export class EventTypesForKeywords extends BaseItem implements IWrapEventTypesForKeywords {
   static defaultValue: IWrapEventTypesForKeywordsAttribute = {
      keyword: '',
      events: [],
      customData: {},
   };

   static create(...data: Partial<IWrapEventTypesForKeywordsAttribute>[]): EventTypesForKeywords[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapEventTypesForKeywordsAttribute, 'customData'> = {}) {
      super();
      this.keyword = data.keyword ?? EventTypesForKeywords.defaultValue.keyword;
      this.events = (data.events ?? EventTypesForKeywords.defaultValue.events)
         .map((e) => e)
         .filter((e) => e) as number[];
      this.customData = deepCopy(data.customData ?? EventTypesForKeywords.defaultValue.customData);
   }

   keyword: IWrapEventTypesForKeywords['keyword'];
   events: IWrapEventTypesForKeywords['events'];

   setKeyword(value: this['keyword']): this {
      this.keyword = value;
      return this;
   }
   setEvents(value: this['events']): this {
      this.events = value;
      return this;
   }

   addEvent(value: number): this {
      this.events.push(value);
      return this;
   }
   removeEvent(value: number): this {
      const index = this.events.indexOf(value, 0);
      if (index > -1) {
         this.events.splice(index, 1);
      }
      return this;
   }
}
