import type {
   IWrapEventTypesForKeywords,
   IWrapEventTypesForKeywordsAttribute,
} from './eventTypesForKeywords.ts';

export interface IWrapEventTypesWithKeywordsAttribute {
   /** Data list of event types with keywords. */
   list: IWrapEventTypesForKeywordsAttribute[];
}

export interface IWrapEventTypesWithKeywords extends IWrapEventTypesWithKeywordsAttribute {
   list: IWrapEventTypesForKeywords[];
}
