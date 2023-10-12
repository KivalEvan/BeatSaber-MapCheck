export interface ISerializable<T extends { [P in keyof T]: T[P] }> {
   /** Standard serializer used in JSON. */
   toJSON(): T;
   /** Convert class object into serialized string. */
   serialize(): string;
   /** Clone class object without referencing the original. */
   clone(): this;
}
