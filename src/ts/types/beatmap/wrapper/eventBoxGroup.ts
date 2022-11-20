import { IWrapBaseObject } from './baseObject';
import { IWrapEventBox } from './eventBox';

export interface IWrapEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseObject<TGroup> {
    /** Group ID `<int>` of event box group */
    id: number;
    boxes: IWrapEventBox<TBox, TBase, TFilter>[];
}
