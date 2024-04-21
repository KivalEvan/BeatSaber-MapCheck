import logger from '../../logger.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import { Info as V1Info } from '../../beatmap/v1/info.ts';
import { Info as V2Info } from '../../beatmap/v2/info.ts';
import { Info as V4Info } from '../../beatmap/v4/info.ts';
import { shallowCopy } from '../../utils/misc.ts';
import { DifficultyRanking } from '../../beatmap/shared/difficulty.ts';

function tag(name: string): string[] {
   return ['convert', 'toV1Info', name];
}

export function toV1Info(data: IWrapInfo): V1Info {
   logger.tWarn(tag('main'), 'Converting to beatmap v1 may lose certain data!');

   let template = new V1Info();
   switch (true) {
      case data instanceof V1Info:
         template = new V1Info(data);
         break;
      case data instanceof V2Info:
         fromV2Info(template, data as V2Info);
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

function fromV2Info(template: V1Info, data: V2Info) {
   template.songName = data.songName;
   template.songSubName = data.songSubName;
   template.songAuthorName = data.songAuthorName;
   template.beatsPerMinute = data.beatsPerMinute;
   template.previewStartTime = data.previewStartTime;
   template.previewDuration = data.previewDuration;
   template.coverImageFilename = data.coverImageFilename;
   template.environmentName = data.environmentName;
   data.listMap().forEach(([characteristic, m]) => {
      template.addMap(
         {
            difficulty: m.difficulty,
            difficultyRank: m.rank as 1,
            audioPath: data.songFilename,
            jsonPath: m.filename,
            characteristic: characteristic,
            offset: m.customData?._editorOffset,
            oldOffset: m.customData?._editorOldOffset,
            chromaToggle: 'Off',
            customColors: !!(
               m.customData?._colorLeft ||
               m.customData?._colorRight ||
               m.customData?._envColorLeft ||
               m.customData?._envColorRight ||
               m.customData?._obstacleColor
            ),
            difficultyLabel: m.customData?._difficultyLabel,
            colorLeft: shallowCopy(m.customData._colorLeft),
            colorRight: shallowCopy(m.customData._colorRight),
            envColorLeft: shallowCopy(m.customData._envColorLeft),
            envColorRight: shallowCopy(m.customData._envColorRight),
            obstacleColor: shallowCopy(m.customData._obstacleColor),
         },
         characteristic,
      );
   });
   template.oneSaber = !!data.difficulties.find((m) => m.characteristic === 'OneSaber');
   template.contributors = data.customData?._contributors || [];
   template.customEnvironment = data.customData?._customEnvironment;
   template.customEnvironmentHash = data.customData?._customEnvironmentHash;
}

function fromV4Info(template: V1Info, data: V4Info) {
   template.songName = data.song.title;
   template.songSubName = data.song.subTitle;
   template.songAuthorName = data.song.author;

   template.beatsPerMinute = data.audio.bpm;
   template.previewStartTime = data.audio.previewStartTime;
   template.previewDuration = data.audio.previewDuration;
   template.songFilename = data.audio.filename;

   template.coverImageFilename = data.coverImageFilename;
   template.environmentName = data.environmentNames[0] as 'DefaultEnvironment';

   template.contributors = data.customData.contributors;
   template.customEnvironment = data.customData.customEnvironment;
   template.customEnvironmentHash = data.customData.customEnvironmentHash;

   data.listMap().forEach(([_, beatmap]) => {
      template.addMap({
         characteristic: beatmap.characteristic,
         difficulty: beatmap.difficulty,
         difficultyRank: DifficultyRanking[beatmap.difficulty] as 1,
         audioPath: data.audio.filename,
         jsonPath: beatmap.filename,
      });
   });
}
