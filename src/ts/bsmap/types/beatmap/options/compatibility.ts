export interface ICompatibilityOptions {
   /**
    * @default true
    */
   enabled: boolean;
   throwOn: {
      /**
       * Throw if the object is not compatible in version schema.
       *
       * @default true
       */
      incompatibleObject?: boolean;
      /**
       * Throw if the object require Mapping Extensions to function.
       *
       * @default false
       */
      mappingExtensions?: boolean;
   };
}
