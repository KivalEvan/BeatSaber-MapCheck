// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapAudioData } from '../../types/beatmap/wrapper/audioData.ts';
import type { ILoadOptions } from '../../types/beatmap/options/loader.ts';
import { loadBeatmap, tag } from './_main.ts';

/**
 * Load beatmap audio data.
 * ```ts
 * const data = loadAudioData(json, 4);
 * console.log(data);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function loadAudioData(
   json: Record<string, any>,
   version?: number | null,
   options?: ILoadOptions<IWrapAudioData>,
): IWrapAudioData;
export function loadAudioData(
   json: Record<string, any>,
   options?: ILoadOptions<IWrapAudioData>,
): IWrapAudioData;
export function loadAudioData(
   json: Record<string, any>,
   version?: number | null | ILoadOptions<IWrapAudioData>,
   options?: ILoadOptions<IWrapAudioData>,
): IWrapAudioData {
   const ver = typeof version === 'number' ? version : null;
   const opt = (typeof version !== 'number' ? version : options) ?? {};
   logger.tInfo(tag('loadAudioData'), 'Loading audio data from JSON');
   return loadBeatmap('audioData', json, ver, opt);
}
