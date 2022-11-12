import { IWrapEventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { IWrapLightColorEventBox } from './lightColorEventBox';

export interface IWrapLightColorEventBoxGroup<
    TGroup extends Record<keyof TGroup, unknown> = Record<string, unknown>,
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxGroupTemplate<TGroup, TBox, TBase, TFilter> {
    events: IWrapLightColorEventBox<TBox, TBase, TFilter>[];
}
