import type { Version } from './version.ts';

interface IDataCheckBase {
   readonly type: string | string[]; // string array because there'll soon be having to check both
   readonly version: Version;
   readonly array?: boolean;
   readonly optional?: boolean;
}

export interface IDataCheckPrimitive extends IDataCheckBase {
   readonly type: 'string' | 'boolean';
}

export interface IDataCheckNumber extends IDataCheckBase {
   readonly type: 'number';
   readonly int?: boolean;
   readonly unsigned?: boolean;
}

export interface IDataCheckObject extends IDataCheckBase {
   readonly type: 'object' | 'array';
   readonly check: { [key: string]: IDataCheck };
}

export type IDataCheck = IDataCheckPrimitive | IDataCheckNumber | IDataCheckObject;

export interface IDataCheckOption {
   /**
    * If condition is not met, handle an error.
    *
    * `true` to throw error, `false` to warn error.
    */
   throwOn: {
      /**
       * Throw if the key exist outside of schema.
       *
       * @default false
       */
      unused?: boolean;
      /**
       * Throw if the key is missing.
       *
       * @default true
       */
      missing?: boolean;
      /**
       * Ignore the optional condition when checking for missing key.
       *
       * @default false
       */
      ignoreOptional?: boolean;
      /**
       * Throw if the value is nullish or NaN.
       *
       * @default true
       */
      nullish?: boolean;
      /**
       * Throw if the value is not a correct type to schema.
       *
       * @default true
       */
      wrongType?: boolean;
      /**
       * Throw if the value is not an integer.
       *
       * @default false
       */
      notInt?: boolean;
      /**
       * Throw if the value is not an unsigned number.
       *
       * @default false
       */
      notUnsigned?: boolean;
   };
}
