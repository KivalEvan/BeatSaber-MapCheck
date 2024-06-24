import JSZip from 'jszip';
import * as swing from './bsmap/extensions/swing/mod';
import { TimeProcessor } from './bsmap/beatmap/helpers/timeProcessor';
import logger from './bsmap/logger';
import { IWrapInfo, IWrapInfoBeatmap } from './bsmap/types/beatmap/wrapper/info';
import { IBeatmapAudio, IBeatmapItem } from './types/checks/beatmapItem';
import { IBPMInfo } from './bsmap/types/beatmap/v2/bpmInfo';
import { IAudio } from './bsmap/types/beatmap/v4/audioData';
import { IBPMEvent } from './bsmap/types/beatmap/v3/bpmEvent';
import settings from './settings';
import {
   Beatmap,
   NoteJumpSpeed,
   loadDifficulty,
   loadInfo,
   loadLightshow,
} from './bsmap/beatmap/mod';
import { IWrapBeatmap } from './bsmap/types/beatmap/wrapper/beatmap';
import { IObjectContainer, ObjectContainerType } from './types/checks/container';
import { IWrapBaseObject } from './bsmap/types/beatmap/wrapper/baseObject';

function tag(name: string) {
   return ['load', name];
}

export async function extractBpmInfo(info: IWrapInfo, zip: JSZip): Promise<IBeatmapAudio | null> {
   if (info.version === 4) {
      const audioFile = zip.file(info.audio.audioDataFilename);
      logger.tInfo(tag('extractBPMInfo'), 'loading', info.audio.audioDataFilename);
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
   }
   const bpmFile = zip.file('BPMInfo.dat');
   logger.tInfo(tag('extractBPMInfo'), 'loading BPMInfo.dat');
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
   return infoFile.async('string').then(JSON.parse).then(loadInfo);
}

async function fetchLightshow(
   zip: JSZip,
   infoDiff: IWrapInfoBeatmap,
): Promise<[any, IWrapBeatmap] | null> {
   const file = zip.file(infoDiff.lightshowFilename);
   if (!file) {
      logger.tError(
         tag('extractBeatmaps'),
         `Missing ${infoDiff.lightshowFilename} lightshow file for ${infoDiff.characteristic} ${infoDiff.difficulty}, ignoring.`,
      );
   }
   logger.tInfo(
      tag('extractBeatmaps'),
      `Loading ${infoDiff.characteristic} ${infoDiff.difficulty} lightshow`,
   );
   try {
      const json = await file!.async('string').then(JSON.parse);
      const lightshow = loadLightshow(json, { sort: settings.sorting });
      return [json, lightshow];
   } catch (err) {
      logger.tError(
         tag('extractBeatmaps'),
         `Could not load ${infoDiff.lightshowFilename} lightshow file; ${err}`,
      );
   }
   return null;
}

export function extractBeatmaps(info: IWrapInfo, zip: JSZip): Promise<IBeatmapItem | null>[] {
   const loaded: Record<string, Promise<[any, IWrapBeatmap] | null>> = {};
   return info.difficulties.map(async (d) => {
      const infoDiff = d;
      const difficultyFile = zip.file(infoDiff.filename);
      if (!difficultyFile) {
         logger.tError(
            tag('extractBeatmaps'),
            `Missing ${infoDiff.filename} file for ${infoDiff.characteristic} ${infoDiff.difficulty}, ignoring.`,
         );
         return null;
      }
      logger.tInfo(
         tag('extractBeatmaps'),
         `Loading ${infoDiff.characteristic} ${infoDiff.difficulty}`,
      );
      let jsonDifficulty;
      try {
         jsonDifficulty = await difficultyFile!.async('string').then(JSON.parse);
      } catch (err) {
         throw new Error(`${infoDiff.characteristic} ${infoDiff.difficulty} ${err}`);
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
            `${infoDiff.characteristic} ${infoDiff.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
         );
      }
      let data = loadDifficulty(jsonDifficulty, { sort: settings.sorting });

      let lightshow = jsonDifficultyVer === 4 ? new Beatmap() : data;
      let jsonLightshow;
      if (jsonDifficultyVer === 4) {
         if (!loaded[infoDiff.lightshowFilename])
            loaded[infoDiff.lightshowFilename] = fetchLightshow(zip, infoDiff);
         const res = await loaded[infoDiff.lightshowFilename];
         if (res) {
            jsonLightshow = res[0];
            lightshow = res[1];
         }
      }
      data.lightshow = lightshow.lightshow;

      const timeProcessor = TimeProcessor.create(
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
         infoDiff.customData?._editorOffset,
      );
      precalculateTimes(data, timeProcessor);

      return {
         settings: infoDiff,
         environment:
            (infoDiff.environmentId > 0
               ? info.environmentNames.at(infoDiff.environmentId)
               : info.environmentNames[0]) || 'DefaultEnvironment',
         timeProcessor,
         njs: new NoteJumpSpeed(timeProcessor.bpm, infoDiff.njs, infoDiff.njsOffset),
         data,
         noteContainer: getNoteContainer(data),
         swingAnalysis: swing.info(
            data,
            timeProcessor,
            infoDiff.characteristic,
            infoDiff.difficulty,
         ),
         rawVersion: jsonDifficultyVer as 4,
         rawData: jsonDifficulty,
         rawLightshow: jsonLightshow,
      };
   });
}

function getNoteContainer(beatmap: IWrapBeatmap): IObjectContainer[] {
   return [
      ...beatmap.colorNotes.map((e) => ({
         data: e,
         type: ObjectContainerType.COLOR,
      })),
      ...beatmap.bombNotes.map((e) => ({
         data: e,
         type: ObjectContainerType.BOMB,
      })),
      ...beatmap.chains.map((e) => ({
         data: e,
         type: ObjectContainerType.CHAIN,
      })),
      ...beatmap.arcs.map((e) => ({
         data: e,
         type: ObjectContainerType.ARC,
      })),
   ].sort((a, b) => a.data.time - b.data.time) as IObjectContainer[];
}

function precalculateTimes(beatmap: IWrapBeatmap, timeProcessor: TimeProcessor) {
   const fn = applyTime(timeProcessor);
   if (!beatmap.difficulty.customData.__mapcheck_precalculatetime) {
      beatmap.bpmEvents.forEach(fn);
      beatmap.rotationEvents.forEach(fn);
      beatmap.colorNotes.forEach(fn);
      beatmap.bombNotes.forEach(fn);
      beatmap.obstacles.forEach(fn);
      beatmap.arcs.forEach(fn);
      beatmap.chains.forEach(fn);
      beatmap.difficulty.customData.__mapcheck_precalculatetime = true;
   }

   if (!beatmap.lightshow.customData.__mapcheck_precalculatetimelightshow) {
      beatmap.waypoints.forEach(fn);
      beatmap.basicEvents.forEach(fn);
      beatmap.colorBoostEvents.forEach(fn);
      beatmap.lightColorEventBoxGroups.forEach(fn);
      beatmap.lightRotationEventBoxGroups.forEach(fn);
      beatmap.lightTranslationEventBoxGroups.forEach(fn);
      beatmap.fxEventBoxGroups.forEach(fn);
      beatmap.lightshow.customData.__mapcheck_precalculatetimelightshow = true;
   }
}

function applyTime(timeProcessor: TimeProcessor) {
   return function (object: IWrapBaseObject) {
      object.customData.__mapcheck_secondtime = timeProcessor.toRealTime(object.time, true);
      object.customData.__mapcheck_beattime = timeProcessor.adjustTime(object.time);
   };
}
