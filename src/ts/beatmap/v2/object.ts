import { IBaseObject } from '../../types/beatmap/v2/object';
import { Serializable } from '../shared/serializable';

export abstract class BeatmapObject<T extends IBaseObject> extends Serializable<T> {
    /** Beat time `<float>` of beatmap object. */
    get time() {
        return this.data._time;
    }
    set time(value: number) {
        this.data._time = value;
    }

    get customData() {
        return this.data._customData;
    }
    set customData(value: typeof this.data._customData) {
        this.data._customData = value;
    }

    setCustomData(value: typeof this.data._customData) {
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
    addCustomData(object: Record<string, T['_customData']>) {
        this.customData = { ...this.customData, object };
        return this;
    }
}
