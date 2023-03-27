import { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup';
import { IWrapLightColorEventBox, IWrapLightColorEventBoxAttribute } from './lightColorEventBox';

export interface IWrapLightColorEventBoxGroupAttribute<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapLightColorEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapLightColorEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter>,
        IWrapLightColorEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapLightColorEventBox<TBox, TBase, TFilter>[];
}
