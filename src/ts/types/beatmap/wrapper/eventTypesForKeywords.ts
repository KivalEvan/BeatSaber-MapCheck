// deno-lint-ignore-file no-explicit-any
import type { ISerializable } from '../shared/serializable.ts';

export interface IWrapEventTypesForKeywordsAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> {
   /** Keyword `<string>` of event types for keywords. */
   keyword: string;
   /** Event type `<int[]>` of event types for keywords. */
   events: number[];
}

export interface IWrapEventTypesForKeywords<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends ISerializable<T>,
      IWrapEventTypesForKeywordsAttribute<T> {
   setKeyword(value: IWrapEventTypesForKeywords['keyword']): this;
   setEvents(value: IWrapEventTypesForKeywords['events']): this;

   addEvent(value: number): this;
   removeEvent(value: number): this;
}
