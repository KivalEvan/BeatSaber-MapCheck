import { ISerializable } from '../../types/beatmap/shared/serializable';

export abstract class Serializable<T extends { [P in keyof T]: T[P] }> implements ISerializable<T> {
   abstract toJSON(): T;
   serialize() {
      return JSON.stringify(this.toJSON());
   }
   clone<U extends this>(): U {
      return new (this.constructor as { new (data: T): U })(this.toJSON());
   }
}
