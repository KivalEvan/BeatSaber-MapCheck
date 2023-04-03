import { ISerializable } from '../shared/serializable';

export interface IWrapEventTypesForKeywordsAttribute<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> {
    /** Keyword `<string>` of event types for keywords. */
    keyword: string;
    /** Event type `<int[]>` of event types for keywords. */
    events: number[];
}

export interface IWrapEventTypesForKeywords<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> extends ISerializable<T>,
        IWrapEventTypesForKeywordsAttribute<T> {
    setKeyword(value: IWrapEventTypesForKeywords['keyword']): this;
    setEvents(value: IWrapEventTypesForKeywords['events']): this;

    addEvent(value: number): this;
    removeEvent(value: number): this;
}
