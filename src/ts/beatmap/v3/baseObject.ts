import { IBaseObject } from '../../types/beatmap/v3/baseObject';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap v3 object. */
export abstract class BaseObject<T extends IBaseObject> extends Serializable<T> {
    /** Beat time `<float>` of beatmap object. */
    get time() {
        return this.data.b;
    }
    set time(value: number) {
        this.data.b = value;
    }

    /** Custom data `<object>` of beatmap object.
     *
     * This has no type-safety for unsupported data.
     */
    get customData(): NonNullable<T['customData']> {
        return this.data.customData as NonNullable<T['customData']>;
    }
    set customData(value: NonNullable<T['customData']>) {
        this.data.customData = value;
    }

    setTime(value: number) {
        this.time = value;
        return this;
    }

    setCustomData(value: NonNullable<T['customData']>) {
        this.customData = value;
        return this;
    }
    resetCustomData() {
        this.customData = {} as NonNullable<T['customData']>;
        return this;
    }
    removeCustomData(key: string) {
        if (this.customData) {
            delete this.customData[key];
        }
        return this;
    }
    addCustomData(object: Record<string, T['customData']>) {
        this.customData = { ...this.customData, object };
        return this;
    }
}
