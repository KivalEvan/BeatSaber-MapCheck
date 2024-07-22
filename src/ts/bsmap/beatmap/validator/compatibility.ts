// deno-lint-ignore-file no-explicit-any
import logger from '../../logger.ts';
import type { BeatmapFileType } from '../../types/beatmap/shared/schema.ts';
import type { ICompatibilityOptions } from '../../types/beatmap/options/compatibility.ts';
import {
   audioDataCompatibilityMap,
   difficultyCompatibilityMap,
   infoCompatibilityMap,
   lightshowCompatibilityMap,
} from '../mapping/compatibility.ts';

function tag(name: string): string[] {
   return ['validator', name];
}

const defaultOptions: ICompatibilityOptions = {
   enabled: true,
   throwOn: { incompatibleObject: true, mappingExtensions: false },
};

export function compatibilityCheck<T extends Record<string, any> = Record<string, any>>(
   type: BeatmapFileType,
   data: T,
   version: number,
   options?: Partial<ICompatibilityOptions>,
): T {
   const opt: Required<ICompatibilityOptions> = {
      enabled: options?.enabled ?? defaultOptions.enabled,
      throwOn: {
         ...defaultOptions.throwOn,
         ...options?.throwOn,
      },
   };
   let compatibilityMap: Record<number, any> = {};
   switch (type) {
      case 'info':
         compatibilityMap = infoCompatibilityMap;
         break;
      case 'audioData':
         compatibilityMap = audioDataCompatibilityMap;
         break;
      case 'difficulty':
         compatibilityMap = difficultyCompatibilityMap;
         break;
      case 'lightshow':
         compatibilityMap = lightshowCompatibilityMap;
         break;
   }

   const compatFn = compatibilityMap[version];
   if (compatFn) {
      logger.tInfo(
         tag('compatibilityCheck'),
         'Checking beatmap compatibility for ' + type + ' with version',
         version,
      );
      compatFn(data, opt);
   }

   return data;
}
