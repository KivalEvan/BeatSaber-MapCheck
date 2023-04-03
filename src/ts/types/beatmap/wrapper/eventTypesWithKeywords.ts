import { ISerializable } from '../shared/serializable';
import {
    IWrapEventTypesForKeywords,
    IWrapEventTypesForKeywordsAttribute,
} from './eventTypesForKeywords';

export interface IWrapEventTypesWithKeywordsAttribute<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> {
    /** Data list of event types with keywords. */
    list: IWrapEventTypesForKeywordsAttribute[];
}

export interface IWrapEventTypesWithKeywords<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> extends ISerializable<T>,
        IWrapEventTypesWithKeywordsAttribute<T> {
    list: IWrapEventTypesForKeywords[];

    setData(value: IWrapEventTypesForKeywords[]): this;
    addData(value: IWrapEventTypesForKeywords): this;
    removeData(value: string): this;
}
