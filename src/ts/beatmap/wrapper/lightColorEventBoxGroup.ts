import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { IWrapLightColorEventBoxGroup } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { WrapEventBoxGroup } from './eventBoxGroup';

/** Light color event box group beatmap class object. */
export abstract class WrapLightColorEventBoxGroup<
        TGroup extends Record<keyof TGroup, unknown>,
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
    implements IWrapLightColorEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
    abstract get boxes(): IWrapLightColorEventBox<TBox, TBase, TFilter>[];
    abstract set boxes(value: IWrapLightColorEventBox<TBox, TBase, TFilter>[]);
}
