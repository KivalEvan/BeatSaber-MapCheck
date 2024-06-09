// deno-lint-ignore-file no-explicit-any
import type { ILoadOptions } from '../beatmap/options/loader.ts';
import type { IBaseOptions } from './_common.ts';

export interface IReadOptions<T extends Record<string, any> = Record<string, any>>
   extends IBaseOptions {
   load?: ILoadOptions<T>;
}
