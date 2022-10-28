export interface IWrapEventTypesForKeywords {
    /** Keyword `<string>` of event types for keywords. */
    keyword: string;
    /** Event type `<int[]>` of event types for keywords. */
    events: number[];

    setKeyword(value: IWrapEventTypesForKeywords['keyword']): this;
    setEvents(value: IWrapEventTypesForKeywords['events']): this;

    addEvent(value: number): this;
    removeEvent(value: number): this;
}
