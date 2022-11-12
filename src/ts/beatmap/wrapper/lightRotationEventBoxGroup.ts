import { WrapEventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { IWrapLightRotationEventBoxGroup } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox';

/** Light rotation event box group beatmap class object. */
export abstract class WrapLightRotationEventBoxGroup<
        TGroup extends Record<keyof TGroup, unknown>,
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapEventBoxGroupTemplate<TGroup, TBox, TBase, TFilter>
    implements IWrapLightRotationEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
    abstract get events(): IWrapLightRotationEventBox<TBox, TBase, TFilter>[];
    abstract set events(value: IWrapLightRotationEventBox<TBox, TBase, TFilter>[]);
}
