// deno-lint-ignore ban-types
export abstract class Serializable<T extends Object> {
    /** Highly not recommended to mess around with this unless you know what you are doing. */
    readonly data: Required<T>;
    constructor(data: Required<T>) {
        this.data = data;
    }

    abstract toObject(): Required<T>;

    /** Convert class object into serialized string. */
    serialize() {
        return JSON.stringify(this.toObject());
    }

    /** Clone class object without referencing the original. */
    clone<U extends this>(): U {
        return new (this.constructor as { new (data: T): U })(this.toObject());
    }
}
