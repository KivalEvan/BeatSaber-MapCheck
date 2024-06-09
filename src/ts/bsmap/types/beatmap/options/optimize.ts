export interface IOptimizeOptions {
   /**
    * Allow JSON optimisation to take place.
    *
    * @default true
    */
   enabled?: boolean;
   /**
    * Round number in JSON by decimal point.
    *
    * @default 4
    */
   floatTrim?: number;
   /**
    * Trim string.
    *
    * @default true
    */
   stringTrim?: boolean;
   /**
    * Remove zero-valued attribute in JSON.
    *
    * @default true
    */
   purgeZeros?: boolean;
   /**
    * Throw error when encountering null or undefined value.
    *
    * @default true
    */
   throwNullish?: boolean;
   /**
    * Deduplicate object in beatmap V4.
    *
    * @default true
    */
   deduplicate?: boolean;
}
