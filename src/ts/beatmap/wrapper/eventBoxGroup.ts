import { IWrapEventBoxGroup } from '../../types/beatmap/wrapper/eventBoxGroup';
import { WrapBaseObject } from './baseObject';

/** Base event box group beatmap class object. */
export abstract class WrapEventBoxGroup<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapEventBoxGroup<T>
{
    abstract get id(): IWrapEventBoxGroup['id'];
    abstract set id(value: IWrapEventBoxGroup['id']);

    isValid(): boolean {
        return this.id >= 0;
    }
}
