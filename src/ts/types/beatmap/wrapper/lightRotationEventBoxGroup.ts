import { IWrapEventBoxGroup } from './eventBoxGroup';
import { IWrapLightRotationEventBox } from './lightRotationEventBox';

export interface IWrapLightRotationEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter> {
    boxes: IWrapLightRotationEventBox<TBox, TBase, TFilter>[];
}
