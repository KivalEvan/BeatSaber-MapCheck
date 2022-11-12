import { ISerializable } from '../shared/serializable';
import { IWrapEventTypesForKeywords } from './eventTypesForKeywords';

export interface IWrapEventTypesWithKeywords<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends ISerializable<T> {
    /** Data list of event types with keywords. */
    list: IWrapEventTypesForKeywords[];

    setData(value: IWrapEventTypesForKeywords[]): this;
    addData(value: IWrapEventTypesForKeywords): this;
    removeData(value: string): this;
}
