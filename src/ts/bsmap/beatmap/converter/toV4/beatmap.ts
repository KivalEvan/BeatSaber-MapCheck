import logger from '../../../logger.ts';
import type { IWrapBeatmap } from '../../../types/beatmap/wrapper/beatmap.ts';
import { toV3Beatmap } from '../toV3/beatmap.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Beatmap', name];
}

export function toV4Beatmap(data: IWrapBeatmap, fromVersion: number): IWrapBeatmap {
   logger.tWarn(
      tag('main'),
      'As v4 is similar to v3, the conversion will use v3 convertor for now.',
   );
   data.version = 4;
   return toV3Beatmap(data, fromVersion);
}
