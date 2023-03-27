import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';
import { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox';

export interface IWrapEventBoxGroupAttribute<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseObjectAttribute<TGroup> {
    /** Group ID `<int>` of event box group */
    id: number;
    boxes: IWrapEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseObject<TGroup>,
        IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapEventBox<TBox, TBase, TFilter>[];
}
