import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';

export interface IWrapBasicEventTypesForKeywordsAttribute extends IWrapBaseItemAttribute {
   /** Keyword `<string>` of event types for keywords. */
   keyword: string;
   /** Event type `<int[]>` of event types for keywords. */
   events: number[];
}

export interface IWrapBasicEventTypesForKeywords
   extends IWrapBaseItem,
      IWrapBasicEventTypesForKeywordsAttribute {
   setKeyword(value: IWrapBasicEventTypesForKeywords['keyword']): this;
   setEvents(value: IWrapBasicEventTypesForKeywords['events']): this;

   addEvent(value: number): this;
   removeEvent(value: number): this;
}
