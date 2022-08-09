// deno-lint-ignore ban-types
export abstract class Serializable<T extends Object> {
    /** Highly not recommended to mess around with this unless you know what you are doing.
     *
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
