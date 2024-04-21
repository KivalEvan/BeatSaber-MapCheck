import logger from '../../logger.ts';
import { Difficulty as V1Difficulty } from '../../beatmap/v1/difficulty.ts';
import { Difficulty as V2Difficulty } from '../../beatmap/v2/difficulty.ts';
import { Difficulty as V3Difficulty } from '../../beatmap/v3/difficulty.ts';
import { Difficulty as V4Difficulty } from '../../beatmap/v4/difficulty.ts';
import { Lightshow as V3Lightshow } from '../../beatmap/v3/lightshow.ts';
import { Lightshow as V4Lightshow } from '../../beatmap/v4/lightshow.ts';
import type { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty.ts';
import type { IWrapInfo, IWrapInfoDifficulty } from '../../types/beatmap/wrapper/info.ts';
import { Info as V2Info } from '../../beatmap/v2/info.ts';
import type { IWrapLightshow } from '../../types/beatmap/wrapper/lightshow.ts';

function tag(name: string): string[] {
   return ['convert', 'toV1Difficulty', name];
}

/**
 * Feeling nostalgic?
 * ```ts
 * const converted = convert.toV1(data);
 * ```
 *
 * **WARNING:** Guess you should know this legacy version does not have modern features.
 */
export function toV1Difficulty(
   data: IWrapDifficulty | IWrapLightshow,
   info: IWrapInfo,
   infoDifficulty: IWrapInfoDifficulty,
): V1Difficulty {
   logger.tWarn(tag('main'), 'Converting beatmap to v1 may lose certain data!');

   let template = new V1Difficulty();
   switch (true) {
      case data instanceof V1Difficulty:
         template = new V1Difficulty(data);
         break;
      case data instanceof V2Difficulty:
         fromV2Difficulty(template, data as V2Difficulty);
         break;
      case data instanceof V3Difficulty:
         fromV3Difficulty(template, data as V3Difficulty);
         break;
      case data instanceof V4Difficulty:
         fromV4Difficulty(template, data as V4Difficulty);
         break;
      case data instanceof V3Lightshow:
         fromV3Lightshow(template, data as V3Lightshow);
         break;
      case data instanceof V4Lightshow:
         fromV4Lightshow(template, data as V4Lightshow);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;
   template.beatsPerMinute = info.audio.bpm;
   if (info instanceof V2Info) {
      template.shuffle = info.shuffle;
      template.shufflePeriod = info.shufflePeriod;
   }
   template.noteJumpSpeed = infoDifficulty.njs;
   template.noteJumpStartBeatOffset = infoDifficulty.njsOffset;

   return template;
}

function fromV2Difficulty(template: V1Difficulty, data: V2Difficulty) {
   template.addColorNotes(...data.colorNotes);
   template.addObstacles(...data.obstacles);
   template.addBasicEvents(...data.basicEvents);

   template.time = data.customData._time ?? 0;
   template.BPMChanges = data.customData._bpmChanges ?? [];
   template.bookmarks = data.customData._bookmarks ?? [];
}

function fromV3Difficulty(template: V1Difficulty, data: V3Difficulty) {
   template.addColorNotes(...data.colorNotes);
   template.addBombNotes(...data.bombNotes);
   template.addObstacles(...data.obstacles);
   template.addBasicEvents(...data.basicEvents);

   template.time = data.customData.time ?? 0;
   template.BPMChanges =
      data.customData.BPMChanges?.map((bpmc) => {
         return {
            _time: bpmc.b,
            _bpm: bpmc.m,
            _beatsPerBar: bpmc.p,
            _metronomeOffset: bpmc.o,
         };
      }) ?? [];
   template.bookmarks =
      data.customData.bookmarks?.map((b) => {
         return { _time: b.b, _name: b.n };
      }) ?? [];
}

function fromV4Difficulty(template: V1Difficulty, data: V4Difficulty) {
   template.addColorNotes(...data.colorNotes);
   template.addBombNotes(...data.bombNotes);
   template.addObstacles(...data.obstacles);
   template.time = data.customData.time ?? 0;
}

function fromV3Lightshow(template: V1Difficulty, data: V3Lightshow) {
   template.addBasicEvents(...data.basicEvents);
}

function fromV4Lightshow(template: V1Difficulty, data: V4Lightshow) {
   template.addBasicEvents(...data.basicEvents);
}
