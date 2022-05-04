import { IBaseObject } from '../../types/beatmap/v3/baseObject';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap. */
export abstract class BaseObject<T extends IBaseObject> extends Serializable<T> {
    /** Beat time `<float>` of beatmap object. */
    get time() {
        return this.data.b;
    }
    set time(value: number) {
        this.data.b = value;
    }

    get customData() {
        return this.data.customData;
    }
    set customData(value: typeof this.data.customData) {
        this.data.customData = value;
    }

    setTime(value: number) {
        this.time = value;
        return this;
    }

    setCustomData(value: typeof this.data.customData) {
        this.customData = value;
        return this;
    }
    deleteCustomData() {
        this.customData = {};
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

    // abstract isValid(): boolean;
}
