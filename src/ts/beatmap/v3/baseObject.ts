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

    setTime(value: number) {
        this.time = value;
        return this;
    }

    // abstract isValid(): boolean;
}
