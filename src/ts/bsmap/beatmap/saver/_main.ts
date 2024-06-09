// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { BeatmapFileType } from '../../types/beatmap/shared/schema.ts';
import type { ISaveOptions } from '../../types/beatmap/options/saver.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import type { IWrapAudioData } from '../../types/beatmap/wrapper/audioData.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import type { IWrapBeatmapFile } from '../../types/beatmap/wrapper/baseFile.ts';
import { validateJSON } from '../schema/validator/main.ts';
import type { IOptimizeOptions } from '../../types/beatmap/options/optimize.ts';
import {
   difficultyOptimizeMap,
   infoOptimizeMap,
   lightshowOptimizeMap,
} from '../mapping/optimizer.ts';
import {
   audioDataSchemaMap,
   difficultySchemaMap,
   infoSchemaMap,
   lightshowSchemaMap,
} from '../mapping/schema.ts';

export function tag(name: string): string[] {
   return ['saver', name];
}

const defaultOptions: Required<ISaveOptions> = {
   format: 0,
   optimize: {
      enabled: true,
      deduplicate: true,
      floatTrim: 4,
      purgeZeros: true,
      stringTrim: true,
      throwNullish: true,
   },
   validate: { enabled: true },
   sort: true,
   preprocess: [],
   postprocess: [],
};

export function saveBeatmap<
   TSerial extends { [key: string]: any },
   TWrap extends { [key: string]: any },
>(
   type: BeatmapFileType,
   data: IWrapBeatmapFile,
   version?: number | null | ISaveOptions<TWrap>,
   options?: ISaveOptions<TWrap>,
): TSerial;
export function saveBeatmap<TSerial extends { [key: string]: any }>(
   type: 'info',
   data: IWrapInfo,
   version?: number | null | ISaveOptions<IWrapInfo>,
   options?: ISaveOptions<IWrapInfo>,
): TSerial;
export function saveBeatmap<TSerial extends { [key: string]: any }>(
   type: 'audioData',
   data: IWrapAudioData,
   version?: number | null | ISaveOptions<IWrapAudioData>,
   options?: ISaveOptions<IWrapAudioData>,
): TSerial;
export function saveBeatmap<TSerial extends { [key: string]: any }>(
   type: 'lightshow',
   data: IWrapBeatmap,
   version?: number | null | ISaveOptions<IWrapBeatmap>,
   options?: ISaveOptions<IWrapBeatmap>,
): TSerial;
export function saveBeatmap<TSerial extends { [key: string]: any }>(
   type: 'difficulty',
   data: IWrapBeatmap,
   version?: number | null | ISaveOptions<IWrapBeatmap>,
   options?: ISaveOptions<IWrapBeatmap>,
): TSerial;
export function saveBeatmap<
   TSerial extends { [key: string]: any },
   TWrap extends { [key: string]: any },
>(
   type: BeatmapFileType,
   data: IWrapBeatmapFile,
   version?: number | null | ISaveOptions<TWrap>,
   options: ISaveOptions<TWrap> = {},
): TSerial {
   let ver: number;
   if (typeof version === 'number') {
      ver = version;
   } else {
      ver = data.version;
      if (ver === -1) {
         throw new Error('Version is not set, prevented from saving.');
      }
      logger.tInfo(tag('saveBeatmap'), 'Implicitly saving ' + type + ' as version', ver);
   }
   const optD = (typeof version !== 'number' ? version : options) ?? options ?? {};
   const opt: Required<ISaveOptions<any>> = {
      format: optD.format ?? defaultOptions.format,
      optimize: { ...defaultOptions.optimize, ...optD.optimize },
      validate: { ...defaultOptions.validate, ...optD.validate },
      sort: optD.sort ?? defaultOptions.sort,
      preprocess: optD.preprocess ?? defaultOptions.preprocess,
      postprocess: optD.postprocess ?? defaultOptions.postprocess,
   };
   let schemaMap;
   let optMap: Record<number, (data: any, options: IOptimizeOptions) => void> = {};
   switch (type) {
      case 'info':
         optMap = infoOptimizeMap;
         schemaMap = infoSchemaMap;
         break;
      case 'audioData':
         schemaMap = audioDataSchemaMap;
         break;
      case 'difficulty':
         optMap = difficultyOptimizeMap;
         schemaMap = difficultySchemaMap;
         break;
      case 'lightshow':
         optMap = lightshowOptimizeMap;
         schemaMap = lightshowSchemaMap;
         break;
   }

   opt.preprocess.forEach((fn, i) => {
      logger.tInfo(tag('saveBeatmap'), 'Running preprocess function #' + (i + 1));
      data = fn(data);
   });

   // TODO: validate beatmap properly
   // if (opt.validate.enabled) {
   //    logger.tInfo(tag('saveBeatmap'), 'Validating beatmap');
   //    if (!data.isValid()) {
   //       logger.tWarn(tag('saveBeatmap'), 'Invalid data detected in beatmap');
   //    }
   // }

   if (opt.sort) {
      logger.tInfo(tag('saveBeatmap'), 'Sorting beatmap objects');
      data.sort();
   }

   logger.tInfo(tag('saveBeatmap'), 'Serializing beatmap ' + type + ' as JSON');
   let json = schemaMap[ver]?.serialize(data as any);
   if (!json) {
      throw new Error('Failed to serialize beatmap, version ' + ver + ' is not supported.');
   }

   if (opt.optimize.enabled) {
      logger.tInfo(tag('saveBeatmap'), 'Optimizing beatmap JSON');
      optMap[ver]?.(json, opt.optimize);
   }

   if (opt.validate.enabled) {
      validateJSON(type, json, ver, opt.validate?.dataCheck);
   }

   opt.postprocess.forEach((fn, i) => {
      logger.tInfo(tag('saveBeatmap'), 'Running postprocess function #' + (i + 1));
      json = fn(json);
   });

   return json as TSerial;
}
