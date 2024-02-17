import JSZip from 'jszip';
import * as swing from './analyzers/swing/mod';
import { BeatPerMinute } from './beatmap/shared/bpm';
import { toV4Difficulty, toV4Info } from './converter/mod';
import * as parse from './beatmap/parse';
import logger from './logger';
import { IWrapInfo } from './types/beatmap/wrapper/info';
import { IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { IWrapDifficulty } from './types/beatmap/wrapper/difficulty';
import { Lightshow } from './beatmap/v4/lightshow';

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

   return toV4Difficulty(data).sort();
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

   let data: IWrapDifficulty;
   const parser = parseLightshowMap[jsonVer];
   if (parser) data = parser(json);
   else {
      throw new Error(
         `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return toV4Difficulty(data).sort();
}

export async function loadInfo(zip: JSZip) {
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

export async function loadDifficulties(info: IWrapInfo, zip: JSZip) {
   const beatmapItem: IBeatmapItem[] = [];
   for (let i = 0; i < info.difficulties.length; i++) {
      const diffInfo = info.difficulties[i];
      const diffFile = zip.file(diffInfo.filename as string);
      if (diffFile) {
         logger.tInfo(
            tag('loadDifficulty'),
            `Loading ${diffInfo.characteristic} ${diffInfo.difficulty}`,
         );
         let json;
         try {
            json = await diffFile.async('string').then(JSON.parse);
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
               tag('loadDifficulty'),
               `${diffInfo.characteristic} ${diffInfo.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
            );
         }
         try {
            const data = _difficulty(json);
            const bpm = BeatPerMinute.create(
               info.audio.bpm,
               jsonVer === 3
                  ? [
                       ...(data.customData.BPMChanges ?? []),
                       ...data.bpmEvents.map((be) => be.toJSON()),
                    ]
                  : jsonVer === 2
                    ? data.customData._BPMChanges ?? data.customData._bpmChanges
                    : jsonVer === 1
                      ? json._BPMChanges
                      : [],
               diffInfo.customData?._editorOffset,
            );
            beatmapItem.push({
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
            });
         } catch (err) {
            throw err;
         }
      } else {
         logger.tError(
            tag('loadDifficulty'),
            `Missing ${diffInfo.filename} file for ${diffInfo.characteristic} ${diffInfo.difficulty}, ignoring.`,
         );
         info.difficulties.splice(i, 1);
         i--;
      }
   }
   return beatmapItem;
}
