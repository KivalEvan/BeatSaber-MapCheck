export interface ICleanOptions {
   /** Round number in JSON by decimal point. */
   floatTrim?: number;
   /** Trim string. */
   stringTrim?: boolean;
   /** Throw error when encountering null or undefined value. */
   throwError?: boolean;
}
