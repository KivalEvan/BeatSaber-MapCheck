// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import type { ILoadOptions } from '../../types/beatmap/options/loader.ts';
import { loadBeatmap, tag } from './_main.ts';

/**
 * Load beatmap info.
 * ```ts
 * const data = loadInfo(json, 4);
 * console.log(data);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function loadInfo(
   json: Record<string, any>,
   version?: number | null,
   options?: ILoadOptions<IWrapInfo>,
): IWrapInfo;
export function loadInfo(json: Record<string, any>, options?: ILoadOptions<IWrapInfo>): IWrapInfo;
export function loadInfo(
   json: Record<string, any>,
   version?: number | null | ILoadOptions<IWrapInfo>,
   options?: ILoadOptions<IWrapInfo>,
): IWrapInfo {
   const ver = typeof version === 'number' ? version : null;
   const opt = (typeof version !== 'number' ? version : options) ?? {};
   logger.tInfo(tag('loadInfo'), 'Loading info from JSON');
   return loadBeatmap('info', json, ver, opt);
}
