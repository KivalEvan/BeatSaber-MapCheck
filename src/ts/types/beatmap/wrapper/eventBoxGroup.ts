import { IWrapBaseObject } from './baseObject';

export interface IWrapEventBoxGroup<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObject<T> {
    /** Group ID `<int>` of event box group */
    id: number;
}
