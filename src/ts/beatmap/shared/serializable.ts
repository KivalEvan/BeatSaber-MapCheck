// deno-lint-ignore ban-types
export abstract class Serializable<T extends Object> {
    protected data: Required<T>;
    constructor(data: Required<T>) {
        this.data = data;
    }

    abstract toObject(): T;

    serialize() {
        return JSON.stringify(this.toObject());
    }
}
