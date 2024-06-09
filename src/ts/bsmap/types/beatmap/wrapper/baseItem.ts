import type { ICustomDataBase } from '../shared/custom/customData.ts';
import type { ICloneable } from '../shared/cloneable.ts';

export interface IWrapBaseItemAttribute {
   /**
    * Custom data `<object>` of beatmap object.
    *
    * This has no type-safety for unsupported data.
    */
   customData: ICustomDataBase;
}

export interface IWrapBaseItem extends ICloneable, IWrapBaseItemAttribute {
   setCustomData(value: this['customData']): this;
   resetCustomData(): this;
   removeCustomData(key: string): this;
   addCustomData(object: this['customData']): this;

   /**
    * Sort beatmap object(s) accordingly.
    *
    * Certain objects may not contain sortable array.
    *
    * Custom function can be provided and will run after base implemention.
    */
   sort(fn?: (object: this) => void): this;

   /** Allow for advanced custom function. */
   perform(fn: (object: this) => void): this;

   /**
    * Check if object is valid in vanilla game.
    * This may also allow for value outside of intended value as long as it does not cause
    * weird, inconsistent behaviour or unable to load the map.
    *
    * However, this validity may not be applicable to older version of the game or schema.
    *
    * Override allow for custom function to take over rather than run alongside.
    *
    * @example
    * ```ts
    * if (!obj.isValid(optionalFn)) {}
    * ```
    */
   isValid(fn?: (object: this) => boolean, override?: boolean): boolean;

   /**
    * Check an object given a custom function.
    *
    * @example
    * ```ts
    * if (obj.check(hasChromaFn)) {}
    * ```
    */
   check(fn?: (object: this) => boolean): boolean;
}
