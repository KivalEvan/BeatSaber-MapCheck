// deno-lint-ignore-file no-explicit-any
import { deepCheck } from '../../helpers/dataCheck.ts';
import logger from '../../../logger.ts';
import type { IDataCheck, IDataCheckOption } from '../../../types/beatmap/shared/dataCheck.ts';
import {
   audioDataCheckMap,
   difficultyCheckMap,
   infoCheckMap,
   lightshowCheckMap,
} from '../../mapping/validator.ts';
import { implicitVersion, retrieveVersion } from '../../helpers/version.ts';
import type { BeatmapFileType } from '../../../types/beatmap/shared/schema.ts';

function tag(name: string): string[] {
   return ['validator', name];
}

const defaultOptions: IDataCheckOption = {
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
   options?: Partial<IDataCheckOption>,
): T {
   const opt: Required<IDataCheckOption> = {
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
