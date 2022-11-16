import { IWrapEventTypesForKeywords } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { IWrapEventTypesWithKeywords } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { Serializable } from '../shared/serializable';

/** Basic event types with keywords beatmap class object. */
export abstract class WrapEventTypesWithKeywords<T extends Record<keyof T, unknown>, U extends Record<keyof U, unknown>>
    extends Serializable<T>
    implements IWrapEventTypesWithKeywords<T>
{
    abstract get list(): IWrapEventTypesForKeywords<U>[];
    abstract set list(value: IWrapEventTypesForKeywords<U>[]);

    setData(value: IWrapEventTypesForKeywords<U>[]) {
        this.list = value;
        return this;
    }
    abstract addData(value: IWrapEventTypesForKeywords<U>): this;
    removeData(value: string) {
        this.list = this.list.filter((d) => d.keyword !== value);
        return this;
    }
}
