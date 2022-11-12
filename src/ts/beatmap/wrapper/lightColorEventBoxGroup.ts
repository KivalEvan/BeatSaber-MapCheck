import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { IWrapLightColorEventBoxGroup } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { WrapEventBoxGroupTemplate } from './eventBoxGroupTemplate';

/** Light color event box group beatmap class object. */
export abstract class WrapLightColorEventBoxGroup<
        TGroup extends Record<keyof TGroup, unknown>,
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBoxGroupTemplate<TGroup, TBox, TBase, TFilter>
    implements IWrapLightColorEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
    abstract get events(): IWrapLightColorEventBox<TBox, TBase, TFilter>[];
    abstract set events(value: IWrapLightColorEventBox<TBox, TBase, TFilter>[]);
}
