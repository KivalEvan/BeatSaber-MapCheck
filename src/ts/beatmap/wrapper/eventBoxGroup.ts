import { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox';
import { IWrapEventBoxGroup } from '../../types/beatmap/wrapper/eventBoxGroup';
import { WrapBaseObject } from './baseObject';

/** Base event box group beatmap class object. */
export abstract class WrapEventBoxGroup<
        TGroup extends Record<keyof TGroup, unknown>,
        TBox extends Record<keyof TBox, unknown>,
        TBase extends Record<keyof TBase, unknown>,
        TFilter extends Record<keyof TFilter, unknown>,
    >
    extends WrapBaseObject<TGroup>
    implements IWrapEventBoxGroup<TGroup>
{
    abstract get id(): IWrapEventBoxGroup['id'];
    abstract set id(value: IWrapEventBoxGroup['id']);
    abstract get boxes(): IWrapEventBox<TBox, TBase, TFilter>[];
    abstract set boxes(value: IWrapEventBox<TBox, TBase, TFilter>[]);

    isValid(): boolean {
        return this.id >= 0 && this.boxes.every((e) => e.isValid());
    }
}
