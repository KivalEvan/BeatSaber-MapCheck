// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import type { ISaveOptions } from '../../types/beatmap/options/saver.ts';
import { saveBeatmap, tag } from './_main.ts';

/**
 * Save beatmap info.
 * ```ts
 * const json = saveInfo(data, 4);
 * console.log(json);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function saveInfo<T extends Record<string, any>>(
   data: IWrapInfo,
   version?: number | null,
   options?: ISaveOptions<IWrapInfo>,
): T;
export function saveInfo<T extends Record<string, any>>(
   data: IWrapInfo,
   options?: ISaveOptions<IWrapInfo>,
): T;
export function saveInfo<T extends Record<string, any>>(
   data: IWrapInfo,
   version?: number | null | ISaveOptions<IWrapInfo>,
   options?: ISaveOptions<IWrapInfo>,
): T {
   logger.tInfo(tag('saveInfo'), 'Saving info to JSON');
   return saveBeatmap<T>('info', data, version, options);
}
