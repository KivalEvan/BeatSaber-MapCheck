import JSZip from 'jszip';
import * as swing from './analyzers/swing/mod';
import { BeatPerMinute } from './beatmap/shared/bpm';
import { toV3Difficulty, toV2Info } from './converter/mod';
import * as parse from './beatmap/parse';
import logger from './logger';
import { IWrapInfo } from './types/beatmap/wrapper/info';
import { IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { IWrapDifficulty } from './types/beatmap/wrapper/difficulty';

function tag(name: string) {
   return ['load', name];
}

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
      logger.tWarn(
         tag('_info'),
         'Could not identify info version from JSON, assume implicit version',
         1,
      );
      jsonVer = 1;
   }

   let data: IWrapInfo;
   switch (jsonVer) {
      case 1: {
         data = parse.v1Info(json);
         break;
      }
      case 2: {
         data = parse.v2Info(json);
         break;
      }
      default: {
         throw new Error(
            `Info version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
         );
      }
   }

   return toV2Info(data);
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
      jsonVer = json.songName ? 1 : 2;
      logger.tWarn(
         tag('_difficulty'),
         'Could not identify beatmap version from JSON, assume implicit version',
         jsonVer,
      );
   }

   let data: IWrapDifficulty;
   switch (jsonVer) {
      case 1: {
         data = parse.v1Difficulty(json);
         break;
      }
      case 2: {
         data = parse.v2Difficulty(json);
         break;
      }
      case 3: {
         data = parse.v3Difficulty(json);
         break;
      }
      default: {
         throw new Error(
            `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
         );
      }
   }

   return toV3Difficulty(data).sort();
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

export async function loadDifficulty(info: IWrapInfo, zip: JSZip) {
   const beatmapItem: IBeatmapItem[] = [];
   const set = info.difficultySets;
   for (let i = set.length - 1; i >= 0; i--) {
      const diff = set[i].difficulties;
      if (diff.length === 0 || !diff) {
         logger.tError(tag('loadDifficulty'), 'Empty difficulty set, removing...');
         set.splice(i, 1);
         continue;
      }
      for (let j = 0; j < diff.length; j++) {
         const diffInfo = diff[j];
         const diffFile = zip.file(diffInfo.filename as string);
         if (diffFile) {
            logger.tInfo(
               tag('loadDifficulty'),
               `Loading ${set[i].characteristic} ${diffInfo.difficulty}`,
            );
            let json;
            try {
               json = await diffFile.async('string').then(JSON.parse);
            } catch (err) {
               throw new Error(`${set[i].characteristic} ${diffInfo.difficulty} ${err}`);
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
                  `${set[i].characteristic} ${diffInfo.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
               );
            }
            try {
               const data = _difficulty(json);
               const bpm = BeatPerMinute.create(
                  info.beatsPerMinute,
                  jsonVer === 3
                     ? [
                          ...(data.customData.BPMChanges ?? []),
                          ...data.bpmEvents.map((be) => be.toJSON()),
                       ]
                     : jsonVer === 2
                     ? data.customData._BPMChanges ?? data.customData._bpmChanges
                     : jsonVer === 1
                     ? json.BPMChanges
                     : [],
                  diffInfo.customData?._editorOffset,
               );
               beatmapItem.push({
                  info: diffInfo,
                  characteristic: set[i].characteristic,
                  difficulty: diffInfo.difficulty,
                  bpm,
                  data,
                  noteContainer: data.getNoteContainer(),
                  eventContainer: data.getEventContainer(),
                  swingAnalysis: swing.info(data, bpm, set[i].characteristic, diffInfo.difficulty),
                  rawVersion: jsonVer as 3,
                  rawData: json,
               });
            } catch (err) {
               throw err;
            }
         } else {
            logger.tError(
               tag('loadDifficulty'),
               `Missing ${diffInfo.filename} file for ${set[i].characteristic} ${diffInfo.difficulty}, ignoring.`,
            );
            set[i].difficulties.splice(j, 1);
            j--;
            if (set[i].difficulties.length < 1) {
               logger.tError(
                  ['load'],
                  `${set[i].characteristic} difficulty set now empty, ignoring.`,
               );
               set.splice(i, 1);
               continue;
            }
         }
      }
   }
   return beatmapItem;
}
