import { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup';
import {
    IWrapLightRotationEventBox,
    IWrapLightRotationEventBoxAttribute,
} from './lightRotationEventBox';

export interface IWrapLightRotationEventBoxGroupAttribute<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapLightRotationEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapLightRotationEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter>,
        IWrapLightRotationEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapLightRotationEventBox<TBox, TBase, TFilter>[];
}
