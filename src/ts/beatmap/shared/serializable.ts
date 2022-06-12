import { deepCopy } from '../../utils/misc';

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

    clone<U extends this>(): U {
        const obj = deepCopy(this.data);
        const cloned = new (this.constructor as { new (): U })();
        cloned.data = obj;
        return cloned;
    }
}
