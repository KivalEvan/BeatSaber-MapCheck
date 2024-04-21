// deno-lint-ignore-file no-explicit-any
import type { _ObtainCustomData } from '../../utils.ts';
import type { ISerializable } from '../shared/serializable.ts';

export interface IWrapBaseItemAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>> {
   /**
    * Custom data `<object>` of beatmap object.
    *
    * This has no type-safety for unsupported data.
    */
   customData: _ObtainCustomData<T>;
}

export interface IWrapBaseItem<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends ISerializable<T>,
      IWrapBaseItemAttribute<T> {
   setCustomData(value: _ObtainCustomData<T>): this;
   resetCustomData(): this;
   removeCustomData(key: string): this;
   addCustomData(object: _ObtainCustomData<T>): this;

   /** Allow for advanced custom function. */
   func(fn: (object: this, ...args: any[]) => void, ...args: any[]): this;

   /**
    * Check if object is valid in vanilla game.
    * ```ts
    * if (obj.isValid()) {}
    * ```
    */
   isValid(): boolean;

   /**
    * Check if object has Chroma properties.
    * ```ts
    * if (obj.isChroma()) {}
    * ```
    */
   isChroma(): boolean;

   /**
    * Check if object has Noodle Extensions properties.
    * ```ts
    * if (obj.isNoodleExtensions()) {}
    * ```
    */
   isNoodleExtensions(): boolean;

   /**
    * Check if object has Mapping Extensions properties.
    * ```ts
    * if (obj.isMappingExtensions()) {}
    * ```
    */
   isMappingExtensions(): boolean;
}
