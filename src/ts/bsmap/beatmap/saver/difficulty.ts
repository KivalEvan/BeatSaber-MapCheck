// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import type { ISaveOptions } from '../../types/beatmap/options/saver.ts';
import { saveBeatmap, tag } from './_main.ts';

/**
 * Save beatmap difficulty.
 * ```ts
 * const json = saveDifficulty(data, 4);
 * console.log(json);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function saveDifficulty<T extends Record<string, any>>(
   data: IWrapBeatmap,
   version?: number | null,
   options?: ISaveOptions<IWrapBeatmap>,
): T;
export function saveDifficulty<T extends Record<string, any>>(
   data: IWrapBeatmap,
   options?: ISaveOptions<IWrapBeatmap>,
): T;
export function saveDifficulty<T extends Record<string, any>>(
   data: IWrapBeatmap,
   version?: number | null | ISaveOptions<IWrapBeatmap>,
   options?: ISaveOptions<IWrapBeatmap>,
): T {
   logger.tInfo(tag('saveDifficulty'), 'Saving difficulty to JSON');
   return saveBeatmap<T>('difficulty', data, version, options);
}
