// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import type { ILoadOptions } from '../../types/beatmap/options/loader.ts';
import { loadBeatmap, tag } from './_main.ts';

/**
 * Load beatmap lightshow.
 * ```ts
 * const data = loadLightshow(json, 4);
 * console.log(data);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function loadLightshow(
   json: Record<string, any>,
   version?: number | null,
   options?: ILoadOptions<IWrapBeatmap>,
): IWrapBeatmap;
export function loadLightshow(
   json: Record<string, any>,
   options?: ILoadOptions<IWrapBeatmap>,
): IWrapBeatmap;
export function loadLightshow(
   json: Record<string, any>,
   version?: number | null | ILoadOptions<IWrapBeatmap>,
   options?: ILoadOptions<IWrapBeatmap>,
): IWrapBeatmap {
   const ver = typeof version === 'number' ? version : null;
   const opt = (typeof version !== 'number' ? version : options) ?? {};
   logger.tInfo(tag('loadLightshow'), 'Loading lightshow from JSON');
   return loadBeatmap('lightshow', json, ver, opt);
}
