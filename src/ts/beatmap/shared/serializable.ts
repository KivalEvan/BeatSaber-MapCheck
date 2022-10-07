import { ISerializable } from '../../types/beatmap/shared/serializable';

// deno-lint-ignore no-explicit-any
export abstract class Serializable<T extends Record<string, any> | Record<string, any>[]> implements ISerializable<T> {
    /** Contains serialized information of object data.
     *
     * **WARNING:** Highly not recommended to mess around with this unless you know what you are doing.
     * Array and object may most likely not be affected on save by direct changes here.
     */
    readonly data: Required<T>;
    constructor(data: Required<T>) {
        this.data = data;
    }

    /** Standard serializer used in JSON. */
    abstract toJSON(): Required<T>;

    /** Convert class object into serialized string. */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /** Clone class object without referencing the original. */
    clone<U extends this>(): U {
        return new (this.constructor as { new (data: T): U })(this.toJSON());
    }
}
