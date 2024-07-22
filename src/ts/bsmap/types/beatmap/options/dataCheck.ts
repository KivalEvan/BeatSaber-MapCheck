export interface IDataCheckOptions {
   enabled: boolean;
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
