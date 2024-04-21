import type { ISerializable } from '../../types/beatmap/shared/serializable.ts';

export abstract class Serializable<T extends { [P in keyof T]: T[P] }> implements ISerializable<T> {
   abstract toJSON(): T;
   serialize(): string {
      return JSON.stringify(this.toJSON());
   }
   clone<U extends this>(): U {
      // deno-lint-ignore no-explicit-any
      return new (this.constructor as { new (data: any): U })(this);
   }
}
