// deno-lint-ignore-file no-explicit-any
import { deepCheck } from '../helpers/dataCheck.ts';
import logger from '../../logger.ts';
import type { IDataCheck } from '../../types/beatmap/shared/dataCheck.ts';
import {
   audioDataCheckMap,
   difficultyCheckMap,
   infoCheckMap,
   lightshowCheckMap,
} from '../mapping/validator.ts';
import { implicitVersion, retrieveVersion } from '../helpers/version.ts';
import type { BeatmapFileType } from '../../types/beatmap/shared/schema.ts';
import type { IDataCheckOptions } from '../../types/beatmap/options/dataCheck.ts';

function tag(name: string): string[] {
   return ['validator', name];
}

const defaultOptions: IDataCheckOptions = {
   enabled: true,
   throwOn: {
      unused: false,
      missing: true,
      ignoreOptional: false,
      nullish: true,
      wrongType: true,
      notInt: false,
      notUnsigned: false,
   },
};

export function validateJSON<T extends Record<string, any> = Record<string, any>>(
   type: BeatmapFileType,
   data: T,
   version: number,
   options?: Partial<IDataCheckOptions>,
): T {
   const opt: Required<IDataCheckOptions> = {
      enabled: options?.enabled ?? defaultOptions.enabled,
      throwOn: {
         ...defaultOptions.throwOn,
         ...options?.throwOn,
      },
   };
   let dataCheckMap: Record<number, Record<string, IDataCheck>> = {};
   switch (type) {
      case 'info':
         dataCheckMap = infoCheckMap;
         break;
      case 'audioData':
         dataCheckMap = audioDataCheckMap;
         break;
      case 'difficulty':
         dataCheckMap = difficultyCheckMap;
         break;
      case 'lightshow':
         dataCheckMap = lightshowCheckMap;
         break;
   }

   const ver = retrieveVersion(data) ?? implicitVersion(type);
   logger.tInfo(
      tag('validateJSON'),
      'Validating beatmap JSON for ' + type + ' with version',
      version,
   );
   deepCheck(data, dataCheckMap[version], type, ver, opt.throwOn);

   return data;
}
