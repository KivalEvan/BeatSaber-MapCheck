import JSZip from 'jszip';
import * as swing from './analyzers/swing/mod';
import { BeatPerMinute } from './beatmap/shared/bpm';
import { toV4Difficulty, toV4Info, toV4Lightshow } from './converter/mod';
import * as parse from './beatmap/parse';
import logger from './logger';
import { IWrapInfo } from './types/beatmap/wrapper/info';
import { IBeatmapAudio, IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { IWrapDifficulty } from './types/beatmap/wrapper/difficulty';
import { Lightshow } from './beatmap/v4/lightshow';
import { Difficulty } from './beatmap/v4/difficulty';
import { IWrapLightshow } from './types/beatmap/wrapper/lightshow';
import { IBPMInfo } from './types/beatmap/v2/bpmInfo';
import { IAudio } from './types/beatmap/v4/audioData';
import { IBPMEvent } from './types/beatmap/v3/bpmEvent';
import settings from './settings';

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
   if (parser) {
      data = parser(json, {
         enabled: settings.dataCheck,
         throwError: settings.dataError,
      });
   } else {
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
   if (parser) {
      data = parser(json, {
         enabled: settings.dataCheck,
         throwError: settings.dataError,
      });
   } else {
      throw new Error(
         `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return data;
}

function _lightshow(json: Record<string, unknown>) {
   const jsonVerStr = typeof json.version === 'string' ? json.version.at(0) : null;
   let jsonVer: number;
   if (jsonVerStr) {
      jsonVer = parseInt(jsonVerStr);
   } else {
      logger.tWarn(
         tag('_lightshow'),
         'Could not identify beatmap version from JSON, assume implicit version',
         3,
      );
      jsonVer = 3;
   }

   let data: IWrapLightshow;
   const parser = parseLightshowMap[jsonVer];
   if (parser) {
      data = parser(json, {
         enabled: settings.dataCheck,
         throwError: settings.dataError,
      });
   } else {
      throw new Error(
         `Beatmap version ${jsonVer} is not supported, this may be an error in JSON or is newer than currently supported.`,
      );
   }

   return data;
}

export async function extractBpmInfo(info: IWrapInfo, zip: JSZip): Promise<IBeatmapAudio | null> {
   const bpmFile = zip.file('BPMInfo.dat');
   logger.tInfo(tag('extractBPMInfo'), `loading BPMInfo.dat`);
   if (bpmFile) {
      const bpmInfo = (await bpmFile.async('string').then(JSON.parse)) as IBPMInfo;
      return {
         duration: bpmInfo._songSampleCount / bpmInfo._songFrequency,
         bpm: bpmInfo._regions.map((r) => ({
            time: r._startBeat,
            bpm:
               ((r._endBeat - r._startBeat) /
                  ((r._endSampleIndex - r._startSampleIndex) / bpmInfo._songFrequency)) *
               60,
         })),
      };
   }

   const audioFile = zip.file(info.audio.audioDataFilename);
   if (audioFile) {
      const bpmInfo = (await audioFile.async('string').then(JSON.parse)) as IAudio;
      return {
         duration: bpmInfo.songSampleCount / bpmInfo.songFrequency,
         bpm: bpmInfo.bpmData.map((r) => ({
            time: r.sb,
            bpm: ((r.eb - r.sb) / ((r.ei - r.si) / bpmInfo.songFrequency)) * 60,
         })),
      };
   }

   return null;
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
   logger.tInfo(tag('extractInfo'), `loading info`);
   return infoFile.async('string').then(JSON.parse).then(_info);
}

export function extractBeatmaps(info: IWrapInfo, zip: JSZip): Promise<IBeatmapItem | null>[] {
   return info.difficulties.map(async (d, i) => {
      const diffInfo = d;
      const difficultyFile = zip.file(diffInfo.filename);
      if (!difficultyFile) {
         logger.tError(
            tag('extractBeatmaps'),
            `Missing ${diffInfo.filename} file for ${diffInfo.characteristic} ${diffInfo.difficulty}, ignoring.`,
         );
         return null;
      }
      logger.tInfo(
         tag('extractBeatmaps'),
         `Loading ${diffInfo.characteristic} ${diffInfo.difficulty}`,
      );
      let jsonDifficulty;
      try {
         jsonDifficulty = await difficultyFile!.async('string').then(JSON.parse);
      } catch (err) {
         throw new Error(`${diffInfo.characteristic} ${diffInfo.difficulty} ${err}`);
      }
      let jsonVerStr =
         typeof jsonDifficulty._version === 'string'
            ? jsonDifficulty._version.at(0)
            : typeof jsonDifficulty.version === 'string'
              ? jsonDifficulty.version.at(0)
              : null;
      let jsonDifficultyVer: number;
      if (jsonVerStr) {
         jsonDifficultyVer = parseInt(jsonVerStr);
      } else {
         logger.tWarn(
            tag('extractBeatmaps'),
            'Could not identify beatmap version from JSON, assume implicit version',
            2,
         );
         jsonDifficultyVer = 2;
      }

      if (jsonDifficulty._notes && jsonDifficulty.version) {
         logger.tError(
            tag('extractBeatmaps'),
            `${diffInfo.characteristic} ${diffInfo.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
         );
      }
      try {
         let data = _difficulty(jsonDifficulty);
         let lightshow = jsonDifficultyVer === 4 ? new Lightshow() : toV4Lightshow(data);
         if (jsonDifficultyVer === 4) {
            const lightshowFile = zip.file(diffInfo.lightshowFilename);
            if (!lightshowFile) {
               logger.tError(
                  tag('extractBeatmaps'),
                  `Missing ${diffInfo.lightshowFilename} lightshow file for ${diffInfo.characteristic} ${diffInfo.difficulty}, ignoring.`,
               );
            }
            logger.tInfo(
               tag('extractBeatmaps'),
               `Loading ${diffInfo.characteristic} ${diffInfo.difficulty} lightshow`,
            );
            let jsonLightshow;
            try {
               jsonLightshow = await lightshowFile!.async('string').then(JSON.parse);
               lightshow = toV4Lightshow(_lightshow(jsonLightshow));
            } catch (err) {
               logger.tError(
                  tag('extractBeatmaps'),
                  `Could not load ${diffInfo.lightshowFilename} lightshow file; ${err}`,
               );
            }
         }
         const bpm = BeatPerMinute.create(
            info.audio.bpm,
            jsonDifficultyVer === 3
               ? [
                    ...(data.customData.BPMChanges ?? []),
                    ...(jsonDifficulty.bpmEvents ?? []).map((be: IBPMEvent) => be),
                 ]
               : jsonDifficultyVer === 2
                 ? data.customData._BPMChanges ?? data.customData._bpmChanges
                 : jsonDifficultyVer === 1
                   ? jsonDifficulty._BPMChanges
                   : [],
            diffInfo.customData?._editorOffset,
         );
         data = toV4Difficulty(data);
         lightshow = lightshow;
         if (settings.sorting) {
            data.sort();
            lightshow.sort();
         }
         return {
            info: diffInfo,
            characteristic: diffInfo.characteristic,
            difficulty: diffInfo.difficulty,
            environment: info.environmentNames.at(diffInfo.environmentId)!,
            bpm,
            data: data as Difficulty,
            lightshow,
            noteContainer: data.getNoteContainer(),
            eventContainer: data.getEventContainer(),
            swingAnalysis: swing.info(data, bpm, diffInfo.characteristic, diffInfo.difficulty),
            rawVersion: jsonDifficultyVer as 4,
            rawData: jsonDifficulty,
         };
      } catch (err) {
         throw err;
      }
   });
}
