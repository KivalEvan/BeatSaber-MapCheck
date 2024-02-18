import JSZip from 'jszip';
import * as swing from './analyzers/swing/mod';
import { BeatPerMinute } from './beatmap/shared/bpm';
import { toV4Difficulty, toV4Info, toV4Lightshow } from './converter/mod';
import * as parse from './beatmap/parse';
import logger from './logger';
import { IWrapInfo } from './types/beatmap/wrapper/info';
import { IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { IWrapDifficulty } from './types/beatmap/wrapper/difficulty';
import { Lightshow } from './beatmap/v4/lightshow';
import { Difficulty } from './beatmap/v4/difficulty';
import { IWrapLightshow } from './types/beatmap/wrapper/lightshow';

function tag(name: string) {
   return ['load', name];
}

const parseInfoMap: Record<number, any> = {
   1: parse.v1Info,
   2: parse.v2Info,
   4: parse.v4Info,
} as const;
const parseDiffMap: Record<number, any> = {
   1: parse.v1Difficulty,
   2: parse.v2Difficulty,
   3: parse.v3Difficulty,
   4: parse.v4Difficulty,
} as const;
const parseLightshowMap: Record<number, any> = {
   3: parse.v3Lightshow,
   4: parse.v4Lightshow,
} as const;

function _info(json: Record<string, unknown>) {
   const jsonVerStr =
      typeof json._version === 'string'
         ? json._version.at(0)
         : typeof json.version === 'string'
           ? json.version.at(0)
           : null;
   let jsonVer: number;
   if (jsonVerStr) {
      jsonVer = parseInt(jsonVerStr);
   } else {
      jsonVer = json.songName ? 1 : 2;
      logger.tWarn(
         tag('_info'),
         'Could not identify info version from JSON, assume implicit version',
         jsonVer,
      );
   }

   let data: IWrapInfo;
   const parser = parseInfoMap[jsonVer];
   if (parser) data = parser(json);
   else {
      throw new Error(
         `Info version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return toV4Info(data);
}

function _difficulty(json: Record<string, unknown>) {
   const jsonVerStr =
      typeof json._version === 'string'
         ? json._version.at(0)
         : typeof json.version === 'string'
           ? json.version.at(0)
           : null;
   let jsonVer: number;
   if (jsonVerStr) {
      jsonVer = parseInt(jsonVerStr);
   } else {
      logger.tWarn(
         tag('_difficulty'),
         'Could not identify beatmap version from JSON, assume implicit version',
         2,
      );
      jsonVer = 2;
   }

   let data: IWrapDifficulty;
   const parser = parseDiffMap[jsonVer];
   if (parser) data = parser(json);
   else {
      throw new Error(
         `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return data instanceof Difficulty ? data : toV4Difficulty(data).sort();
}

function _lightshow(json: Record<string, unknown>) {
   const jsonVerStr =
      typeof json._version === 'string'
         ? json._version.at(0)
         : typeof json.version === 'string'
           ? json.version.at(0)
           : null;
   let jsonVer: number;
   if (jsonVerStr) {
      jsonVer = parseInt(jsonVerStr);
   } else {
      logger.tWarn(
         tag('_lightshow'),
         'Could not identify beatmap version from JSON, assume implicit version',
         2,
      );
      jsonVer = 2;
   }

   let data: IWrapLightshow;
   const parser = parseLightshowMap[jsonVer];
   if (parser) data = parser(json);
   else {
      throw new Error(
         `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return data instanceof Lightshow ? data : toV4Lightshow(data).sort();
}

export async function extractInfo(zip: JSZip) {
   const infoFile =
      zip.file('Info.dat') ||
      zip.file('info.dat') ||
      zip.file('Info.json') ||
      zip.file('info.json');
   if (!infoFile) {
      throw new Error("Couldn't find Info.dat");
   }
   logger.tInfo(tag('loadInfo'), `loading info`);
   return infoFile.async('string').then(JSON.parse).then(_info);
}

export async function extractBeatmaps(
   info: IWrapInfo,
   zip: JSZip,
): Promise<Promise<IBeatmapItem | null>[]> {
   return info.difficulties.map(async (d, i) => {
      const diffInfo = d;
      const diffFile = zip.file(diffInfo.filename);
      if (!diffFile) {
         logger.tError(
            tag('loadDifficulties'),
            `Missing ${diffInfo.filename} file for ${diffInfo.characteristic} ${diffInfo.difficulty}, ignoring.`,
         );
         return null;
      }
      logger.tInfo(
         tag('loadDifficulties'),
         `Loading ${diffInfo.characteristic} ${diffInfo.difficulty}`,
      );
      let json;
      try {
         json = await diffFile!.async('string').then(JSON.parse);
      } catch (err) {
         throw new Error(`${diffInfo.characteristic} ${diffInfo.difficulty} ${err}`);
      }
      const jsonVerStr =
         typeof json._version === 'string'
            ? json._version.at(0)
            : typeof json.version === 'string'
              ? json.version.at(0)
              : null;
      let jsonVer: number;
      if (jsonVerStr) {
         jsonVer = parseInt(jsonVerStr);
      } else {
         logger.tWarn(
            tag('_difficulty'),
            'Could not identify beatmap version from JSON, assume implicit version',
            2,
         );
         jsonVer = 2;
      }

      if (json._notes && json.version) {
         logger.tError(
            tag('loadDifficulties'),
            `${diffInfo.characteristic} ${diffInfo.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
         );
      }
      try {
         const data = _difficulty(json);
         const bpm = BeatPerMinute.create(
            info.audio.bpm,
            jsonVer === 3
               ? [...(data.customData.BPMChanges ?? []), ...data.bpmEvents.map((be) => be.toJSON())]
               : jsonVer === 2
                 ? data.customData._BPMChanges ?? data.customData._bpmChanges
                 : jsonVer === 1
                   ? json._BPMChanges
                   : [],
            diffInfo.customData?._editorOffset,
         );
         return {
            info: diffInfo,
            characteristic: diffInfo.characteristic,
            difficulty: diffInfo.difficulty,
            environment: info.environmentNames.at(diffInfo.environmentId)!,
            bpm,
            data,
            lightshow: new Lightshow(),
            noteContainer: data.getNoteContainer(),
            eventContainer: data.getEventContainer(),
            swingAnalysis: swing.info(data, bpm, diffInfo.characteristic, diffInfo.difficulty),
            rawVersion: jsonVer as 3,
            rawData: json,
         };
      } catch (err) {
         throw err;
      }
   });
}
