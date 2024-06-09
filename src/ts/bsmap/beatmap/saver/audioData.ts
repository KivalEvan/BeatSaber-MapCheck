// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { IWrapAudioData } from '../../types/beatmap/wrapper/audioData.ts';
import type { ISaveOptions } from '../../types/beatmap/options/saver.ts';
import { saveBeatmap, tag } from './_main.ts';

/**
 * Save beatmap audio data.
 * ```ts
 * const json = saveAudioData(data, 4);
 * console.log(json);
 * ```
 *
 * Mismatched beatmap version will be automatically converted, unspecified will leave the version as is but not known.
 */
export function saveAudioData<T extends Record<string, any>>(
   data: IWrapAudioData,
   version?: number | null,
   options?: ISaveOptions<IWrapAudioData>,
): T;
export function saveAudioData<T extends Record<string, any>>(
   data: IWrapAudioData,
   options?: ISaveOptions<IWrapAudioData>,
): T;
export function saveAudioData<T extends Record<string, any>>(
   data: IWrapAudioData,
   version?: number | null | ISaveOptions<IWrapAudioData>,
   options?: ISaveOptions<IWrapAudioData>,
): T {
   logger.tInfo(tag('saveAudioData'), 'Saving audio data to JSON');
   return saveBeatmap<T>('audioData', data, version, options);
}
