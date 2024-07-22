import logger from '../../../logger.ts';
import type { EnvironmentName } from '../../../types/beatmap/shared/environment.ts';
import type { IWrapInfo } from '../../../types/beatmap/wrapper/info.ts';
import { is360Environment } from '../../helpers/environment.ts';

function tag(name: string): string[] {
   return ['convert', 'toV1Info', name];
}

export function toV1Info(data: IWrapInfo, fromVersion: number): IWrapInfo {
   logger.tWarn(tag('main'), 'Converting to beatmap v1 may lose certain data!');

   switch (fromVersion) {
      case 1:
      case 2:
      case 3:
      case 4:
         data.environmentBase.normal =
            data.environmentBase.normal ||
            (data.environmentNames.find((e) => !is360Environment(e)) as EnvironmentName) ||
            'DefaultEnvironment';
         data.version = 1;
         break;
      default:
         logger.tWarn(
            tag('main'),
            'Unknown version: version not supported; misinput? Returning original data.',
         );
   }

   return data;
}
