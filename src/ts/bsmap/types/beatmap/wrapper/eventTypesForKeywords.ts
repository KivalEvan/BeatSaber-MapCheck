import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';

export interface IWrapEventTypesForKeywordsAttribute extends IWrapBaseItemAttribute {
   /** Keyword `<string>` of event types for keywords. */
   keyword: string;
   /** Event type `<int[]>` of event types for keywords. */
   events: number[];
}

export interface IWrapEventTypesForKeywords
   extends IWrapBaseItem,
      IWrapEventTypesForKeywordsAttribute {
   setKeyword(value: IWrapEventTypesForKeywords['keyword']): this;
   setEvents(value: IWrapEventTypesForKeywords['events']): this;

   addEvent(value: number): this;
   removeEvent(value: number): this;
}
