import logger from '../../logger.ts';
import { Info as V1Info } from '../../beatmap/v1/info.ts';
import { Info as V2Info } from '../../beatmap/v2/info.ts';
import { Info as V4Info } from '../../beatmap/v4/info.ts';
import { shallowCopy } from '../../utils/misc.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import { deepCopy } from '../../utils/misc.ts';
import { DifficultyRanking } from '../../beatmap/shared/difficulty.ts';

function tag(name: string): string[] {
   return ['convert', 'toV2Info', name];
}

export function toV2Info(data: IWrapInfo): V2Info {
   logger.tWarn(tag('main'), 'Converting to beatmap v2 may lose certain data!');

   let template = new V2Info();
   switch (true) {
      case data instanceof V1Info:
         fromV1Info(template, data as V1Info);
         break;
      case data instanceof V2Info:
         template = new V2Info(data);
         break;
      case data instanceof V4Info:
         fromV4Info(template, data as V4Info);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}

function fromV1Info(template: V2Info, data: V1Info) {
   template.songName = data.songName;
   template.songSubName = data.songSubName;
   template.songAuthorName = data.songAuthorName;
   template.beatsPerMinute = data.beatsPerMinute;
   template.shuffle = data.shuffle;
   template.shufflePeriod = data.shufflePeriod;
   template.previewStartTime = data.previewStartTime;
   template.previewDuration = data.previewDuration;
   template.songFilename = data.songFilename;
   template.coverImageFilename = data.coverImageFilename;
   template.environmentName = data.environmentName;
   template.allDirectionsEnvironmentName = data.allDirectionsEnvironmentName;
   template.songTimeOffset = data.songTimeOffset;

   template.customData.contributors = data.contributors;
   template.customData.customEnvironment = data.customEnvironment;
   template.customData.customEnvironmentHash = data.customEnvironmentHash;

   data.listMap().forEach(([characteristic, beatmap]) => {
      template.addMap(
         {
            difficulty: beatmap.difficulty,
            rank: beatmap.rank as 1,
            filename: beatmap.filename,
            njs: beatmap.njs,
            njsOffset: beatmap.njsOffset,
            customData: {
               _editorOffset: beatmap.offset,
               _editorOldOffset: beatmap.oldOffset,
               _difficultyLabel: beatmap.difficultyLabel,
               _colorLeft: shallowCopy(beatmap.colorLeft),
               _colorRight: shallowCopy(beatmap.colorRight),
               _envColorLeft: shallowCopy(beatmap.envColorLeft),
               _envColorRight: shallowCopy(beatmap.envColorRight),
               _obstacleColor: shallowCopy(beatmap.obstacleColor),
            },
         },
         characteristic,
      );
   });
}

function fromV4Info(template: V2Info, data: V4Info) {
   template.songName = data.song.title;
   template.songSubName = data.song.subTitle;
   template.songAuthorName = data.song.author;

   template.beatsPerMinute = data.audio.bpm;
   template.previewStartTime = data.audio.previewStartTime;
   template.previewDuration = data.audio.previewDuration;
   template.songFilename = data.audio.filename;

   template.coverImageFilename = data.coverImageFilename;
   template.songFilename = data.songPreviewFilename;
   template.environmentName =
      (data.environmentNames[0] as 'DefaultEnvironment') || 'DefaultEnvironment';
   template.environmentNames = [...data.environmentNames];
   template.colorSchemes = data.colorSchemes.map((d) => shallowCopy(d));

   template.customData = deepCopy(data.customData);
   data.listMap().forEach(([_, beatmap]) => {
      template.addMap(
         {
            difficulty: beatmap.difficulty,
            rank: DifficultyRanking[beatmap.difficulty],
            colorSchemeId: beatmap.colorSchemeId,
            environmentId: beatmap.environmentId,
            njs: beatmap.njs,
            njsOffset: beatmap.njsOffset,
            filename: beatmap.filename,
            customData: deepCopy(beatmap.customData),
         },
         beatmap.characteristic,
      );
      template.levelAuthorName = [
         ...new Set([...beatmap.authors.mappers, ...beatmap.authors.lighters]),
      ].join(', ');
   });
}
