// deno-lint-ignore-file no-explicit-any
import type { ISaveOptions } from '../beatmap/options/saver.ts';
import type { IBaseOptions } from './_common.ts';

export interface IWriteOptions<T extends Record<string, any> = Record<string, any>>
   extends IBaseOptions {
   filename?: string;
   /**
    * Prettify format JSON.
    *
    * @default 0
    */
   format?: number;
   save?: ISaveOptions<T>;
}
