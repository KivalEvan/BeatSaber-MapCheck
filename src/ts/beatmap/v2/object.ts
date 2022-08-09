import { IBaseObject } from '../../types/beatmap/v2/object';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap v2 object. */
export abstract class BeatmapObject<T extends IBaseObject> extends Serializable<T> {
    /** Beat time `<float>` of beatmap object. */
    get time() {
        return this.data._time;
    }
    set time(value: number) {
        this.data._time = value;
    }

    /** Custom data `<object>` of beatmap object.
     *
     * This has no type-safety for unsupported data.
     */
    get customData(): NonNullable<T['_customData']> {
        return this.data._customData as NonNullable<T['_customData']>;
    }
    set customData(value: NonNullable<T['_customData']>) {
        this.data._customData = value;
    }

    setTime(value: number) {
        this.time = value;
        return this;
    }

    setCustomData(value: NonNullable<T['_customData']>) {
        this.customData = value;
        return this;
    }
    resetCustomData() {
        this.customData = {} as NonNullable<T['_customData']>;
        return this;
    }
    removeCustomData(key: string) {
        if (this.customData) {
            delete this.customData[key];
        }
        return this;
    }
    addCustomData(object: T['_customData']) {
        this.customData = { ...this.customData, object };
        return this;
    }
}
