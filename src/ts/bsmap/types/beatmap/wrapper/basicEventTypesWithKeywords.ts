import type {
   IWrapBasicEventTypesForKeywords,
   IWrapBasicEventTypesForKeywordsAttribute,
} from './basicEventTypesForKeywords.ts';

export interface IWrapBasicEventTypesWithKeywordsAttribute {
   /** Data list of event types with keywords. */
   list: IWrapBasicEventTypesForKeywordsAttribute[];
}

export interface IWrapBasicEventTypesWithKeywords
   extends IWrapBasicEventTypesWithKeywordsAttribute {
   list: IWrapBasicEventTypesForKeywords[];
}
