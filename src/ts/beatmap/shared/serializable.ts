import { ISerializable } from '../../types/beatmap/shared/serializable';

export abstract class Serializable<T extends Record<keyof T, unknown> | Record<keyof T, unknown>[]>
    implements ISerializable<T>
{
    /** Contains serialized information of object data.
     *
     * **WARNING:** Highly not recommended to mess around with this unless you know what you are doing.
     * Array and object may most likely not be affected on save by direct changes here.
     */
    readonly data: T;
    constructor(data: T) {
        this.data = data;
    }

    /** Standard serializer used in JSON. */
    abstract toJSON(): T;

    /** Convert class object into serialized string. */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /** Clone class object without referencing the original. */
    clone<U extends this>(): U {
        return new (this.constructor as { new (data: T): U })(this.toJSON());
    }
}
