import { IWrapBaseItem } from '../../types/beatmap/wrapper/baseItem';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap object. */
export abstract class WrapBaseItem<T extends Record<keyof T, unknown>>
    extends Serializable<T>
    implements IWrapBaseItem
{
    abstract get customData(): Record<string, unknown>;
    abstract set customData(value: Record<string, unknown>);

    abstract setCustomData(value: Record<string, unknown>): this;
    resetCustomData() {
        this.customData = {} as Record<string, unknown>;
        return this;
    }
    removeCustomData(key: string | string[]) {
        if (typeof key === 'string') {
            delete this.customData[key];
        } else {
            key.forEach((k) => delete this.customData[k]);
        }
        return this;
    }
    abstract addCustomData(object: Record<string, unknown>): this;

    func(fn: (object: this) => void) {
        fn(this);
        return this;
    }

    abstract isValid(): boolean;

    isChroma(): boolean {
        return false;
    }

    isNoodleExtensions(): boolean {
        return false;
    }

    isMappingExtensions(): boolean {
        return false;
    }
}
