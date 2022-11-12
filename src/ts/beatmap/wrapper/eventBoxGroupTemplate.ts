import { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox';
import { IWrapEventBoxGroupTemplate } from '../../types/beatmap/wrapper/eventBoxGroupTemplate';
import { WrapEventBoxGroup } from './eventBoxGroup';

/** Base event box group template beatmap class object. */
export abstract class WrapEventBoxGroupTemplate<
        TGroup extends Record<keyof TGroup, unknown>,
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBoxGroup<TGroup>
    implements IWrapEventBoxGroupTemplate<TGroup, TBox, TBase, TFilter>
{
    abstract get events(): IWrapEventBox<TBox, TBase, TFilter>[];
    abstract set events(value: IWrapEventBox<TBox, TBase, TFilter>[]);
}
