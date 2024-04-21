import logger from '../../logger.ts';
import { Info as V1Info } from '../../beatmap/v1/info.ts';
import { Info as V2Info } from '../../beatmap/v2/info.ts';
import { Info as V4Info } from '../../beatmap/v4/info.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import { deepCopy, shallowCopy } from '../../utils/misc.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Info', name];
}

export function toV4Info(data: IWrapInfo): V4Info {
   logger.tWarn(tag('main'), 'Converting to beatmap v4 may lose certain data!');

   let template = new V4Info();
   switch (true) {
      case data instanceof V1Info:
         fromV1Info(template, data as V1Info);
         break;
      case data instanceof V2Info:
         fromV2Info(template, data as V2Info);
         break;
      case data instanceof V4Info:
         template = new V4Info(data);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}

function fromV1Info(template: V4Info, data: V1Info) {
   template.song.title = data.songName;
   template.song.subTitle = data.songSubName;
   template.song.author = data.songAuthorName;

   template.audio.bpm = data.beatsPerMinute;
   template.audio.previewStartTime = data.previewStartTime;
   template.audio.previewDuration = data.previewDuration;
   template.audio.filename = data.songFilename;

   template.coverImageFilename = data.coverImageFilename;
   template.environmentNames = [data.environmentName];

   template.customData.contributors = data.contributors;
   template.customData.customEnvironment = data.customEnvironment;
   template.customData.customEnvironmentHash = data.customEnvironmentHash;

   data.listMap().forEach(([_, beatmap]) => {
      template.addMap({
         characteristic: beatmap.characteristic,
         difficulty: beatmap.difficulty,
         authors: {
            mappers: [],
            lighters: [],
         },
         colorSchemeId: beatmap.colorSchemeId,
         environmentId: beatmap.environmentId,
         njs: beatmap.njs,
         njsOffset: beatmap.njsOffset,
         filename: beatmap.filename,
         lightshowFilename: '',
      });
   });
}

function fromV2Info(template: V4Info, data: V2Info) {
   template.song.title = data.songName;
   template.song.subTitle = data.songSubName;
   template.song.author = data.songAuthorName;

   template.audio.bpm = data.beatsPerMinute;
   template.audio.previewStartTime = data.previewStartTime;
   template.audio.previewDuration = data.previewDuration;
   template.audio.filename = data.songFilename;

   template.coverImageFilename = data.coverImageFilename;
   template.songPreviewFilename = data.songFilename;
   template.environmentNames = [...data.environmentNames];
   if (!template.environmentNames.includes(data.environmentName)) {
      template.environmentNames.push(data.environmentName);
   }
   template.colorSchemes = data.colorSchemes.map((d) => shallowCopy(d));

   template.customData = deepCopy(data.customData);
   data.listMap().forEach(([_, beatmap]) => {
      let id = beatmap.environmentId;
      if (template.environmentNames.length - id <= 0) {
         id = 0;
      }
      template.addMap({
         characteristic: beatmap.characteristic,
         difficulty: beatmap.difficulty,
         authors: {
            mappers: [data.levelAuthorName],
            lighters: [],
         },
         colorSchemeId: beatmap.colorSchemeId,
         environmentId: id,
         njs: beatmap.njs,
         njsOffset: beatmap.njsOffset,
         filename: beatmap.filename,
         lightshowFilename: '',
         customData: deepCopy(beatmap.customData),
      });
   });
}
