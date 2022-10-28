import { WrapEventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { IWrapLightRotationEventBoxGroup } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox';

/** Light rotation event box group beatmap class object. */
export abstract class WrapLightRotationEventBoxGroup<T extends Record<keyof T, unknown>>
    extends WrapEventBoxGroupTemplate<T>
    implements IWrapLightRotationEventBoxGroup
{
    abstract get events(): IWrapLightRotationEventBox[];
    abstract set events(value: IWrapLightRotationEventBox[]);
}
