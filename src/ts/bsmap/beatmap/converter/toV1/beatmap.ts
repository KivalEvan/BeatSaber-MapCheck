import logger from '../../../logger.ts';
import type { IWrapBeatmap } from '../../../types/beatmap/wrapper/beatmap.ts';

function tag(name: string): string[] {
   return ['convert', 'toV1Beatmap', name];
}

/**
 * Feeling nostalgic?
 * ```ts
 * const converted = convert.toV1Beatmap(data);
 * ```
 *
 * **WARNING:** Guess you should know this legacy version does not have modern features.
 */
export function toV1Beatmap(data: IWrapBeatmap, fromVersion: number): IWrapBeatmap {
   logger.tWarn(tag('main'), 'Converting beatmap to v1 may lose certain data!');

   switch (fromVersion) {
      case 1:
      case 2:
         data.version = 1;
         break;
      case 3:
         data.version = 1;
         fromV3(data);
         break;
      case 4:
         data.version = 1;
         fromV4(data);
         break;
      default:
         logger.tWarn(
            tag('main'),
            'Unknown version: version not supported; misinput? Returning original data.',
         );
   }

   return data;
}

function fromV3(bm: IWrapBeatmap) {
   bm.difficulty.customData._time = bm.difficulty.customData.time;
   bm.difficulty.customData._BPMChanges = bm.difficulty.customData.BPMChanges?.map((bpmc) => {
      return {
         _time: bpmc.b,
         _BPM: bpmc.m,
         _beatsPerBar: bpmc.p,
         _metronomeOffset: bpmc.o,
      };
   });
   bm.difficulty.customData._bookmarks = bm.difficulty.customData.bookmarks?.map((b) => {
      return { _time: b.b, _name: b.n };
   });

   delete bm.difficulty.customData.time;
   delete bm.difficulty.customData.BPMChanges;
   delete bm.difficulty.customData.bookmarks;
}

function fromV4(data: IWrapBeatmap) {
   data.difficulty.customData._time = data.difficulty.customData.time ?? 0;
}
