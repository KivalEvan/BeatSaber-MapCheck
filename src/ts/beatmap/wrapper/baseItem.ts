import { IWrapBaseItem } from '../../types/beatmap/wrapper/baseItem';
import { ObtainCustomData } from '../../types/utils';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap object. */
export abstract class WrapBaseItem<T extends Record<keyof T, unknown>>
    extends Serializable<T>
    implements IWrapBaseItem<T>
{
    abstract get customData(): ObtainCustomData<T>;
    abstract set customData(value: ObtainCustomData<T>);

    setCustomData(value: ObtainCustomData<T>): this {
        this.customData = value;
        return this;
    }
    resetCustomData() {
        this.customData = {} as ObtainCustomData<T>;
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
    addCustomData(object: ObtainCustomData<T>): this {
        this.customData = { ...this.customData, object };
        return this;
    }

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
