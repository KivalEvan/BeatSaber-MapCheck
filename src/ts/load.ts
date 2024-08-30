import JSZip from 'jszip';
import { IBeatmapAudio, IBeatmapItem } from './types/checks/beatmapItem';
import settings from './settings';
import { IObjectContainer, ObjectContainerType } from './types/checks/container';
import {
   Beatmap,
   calculateScore,
   loadDifficulty,
   loadInfo,
   loadLightshow,
   logger,
   NoteJumpSpeed,
   TimeProcessor,
} from 'bsmap';
import * as types from 'bsmap/types';
import { stats, swing } from 'bsmap/extensions';

function tag(name: string) {
   return ['load', name];
}

export async function extractBpmInfo(
   info: types.wrapper.IWrapInfo,
   zip: JSZip,
   path = '',
): Promise<IBeatmapAudio | null> {
   if (info.version === 4) {
      const audioFile = zip.file(path + info.audio.audioDataFilename);
      logger.tInfo(tag('extractBPMInfo'), 'loading', info.audio.audioDataFilename);
      if (audioFile) {
         const bpmInfo = (await audioFile.async('string').then(JSON.parse)) as types.v4.IAudio;
         return {
            duration: bpmInfo.songSampleCount / bpmInfo.songFrequency,
            bpm: bpmInfo.bpmData.map((r) => ({
               time: r.sb,
               bpm: ((r.eb - r.sb) / ((r.ei - r.si) / bpmInfo.songFrequency)) * 60,
            })),
         };
      }
   }
   const bpmFile = zip.file(path + 'BPMInfo.dat');
   logger.tInfo(tag('extractBPMInfo'), 'loading BPMInfo.dat');
   if (bpmFile) {
      const bpmInfo = (await bpmFile.async('string').then(JSON.parse)) as types.v2.IBPMInfo;
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

export async function extractInfo(zip: JSZip, path = '') {
   const infoFile =
      zip.file(path + 'Info.dat') ||
      zip.file(path + 'info.dat') ||
      zip.file(path + 'Info.json') ||
      zip.file(path + 'info.json');
   if (!infoFile) {
      throw new Error("Couldn't find Info.dat");
   }
   logger.tInfo(tag('extractInfo'), `loading info`);
   return infoFile.async('string').then(JSON.parse).then(loadInfo);
}

async function fetchLightshow(
   zip: JSZip,
   infoDiff: types.wrapper.IWrapInfoBeatmap,
   path = '',
): Promise<[any, types.wrapper.IWrapBeatmap] | null> {
   const file = zip.file(path + infoDiff.lightshowFilename);
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
      const lightshow = loadLightshow(json, {
         sort: settings.sorting,
         schemaCheck: { enabled: settings.dataCheck },
      });
      return [json, lightshow];
   } catch (err) {
      logger.tError(
         tag('extractBeatmaps'),
         `Could not load ${infoDiff.lightshowFilename} lightshow file; ${err}`,
      );
   }
   return null;
}

export function extractBeatmaps(
   info: types.wrapper.IWrapInfo,
   zip: JSZip,
   path = '',
): Promise<IBeatmapItem | null>[] {
   const loaded: Record<string, Promise<[any, types.wrapper.IWrapBeatmap] | null>> = {};
   return info.difficulties.map(async (d) => {
      const infoDiff = d;
      const difficultyFile = zip.file(path + infoDiff.filename);
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
      let data = loadDifficulty(jsonDifficulty, {
         sort: settings.sorting,
         schemaCheck: { enabled: settings.dataCheck },
      });

      let lightshow = jsonDifficultyVer === 4 ? new Beatmap() : data;
      let jsonLightshow;
      if (jsonDifficultyVer === 4) {
         if (!loaded[infoDiff.lightshowFilename]) {
            loaded[infoDiff.lightshowFilename] = fetchLightshow(zip, infoDiff, path);
         }
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
                 ...(jsonDifficulty.bpmEvents ?? []).map((be: types.v3.IBPMEvent) => be),
              ]
            : jsonDifficultyVer === 2
              ? (data.customData._BPMChanges ?? data.customData._bpmChanges)
              : jsonDifficultyVer === 1
                ? jsonDifficulty._BPMChanges
                : [],
         infoDiff.customData?._editorOffset,
      );
      precalculateTimes(data, timeProcessor);

      const env =
         info.environmentNames.at(infoDiff.environmentId) ||
         (infoDiff.characteristic === '360Degree' || infoDiff.characteristic === '90Degree'
            ? info.environmentBase.allDirections
            : info.environmentBase.normal) ||
         'DefaultEnvironment';
      return {
         settings: infoDiff,
         environment: env,
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
         score: calculateScore(data),
         stats: {
            basicEvents: stats.countEvent(data.basicEvents, data.colorBoostEvents, env),
            lightColorEventBoxGroups: stats.countEbg(data.lightColorEventBoxGroups, env),
            lightRotationEventBoxGroups: stats.countEbg(data.lightRotationEventBoxGroups, env),
            lightTranslationEventBoxGroups: stats.countEbg(
               data.lightTranslationEventBoxGroups,
               env,
            ),
            fxEventBoxGroups: stats.countEbg(data.fxEventBoxGroups, env),
            notes: stats.countNote(data.colorNotes),
            bombs: stats.countBomb(data.bombNotes),
            arcs: stats.countNote(data.arcs),
            chains: stats.countNote(data.chains),
            obstacles: stats.countObstacle(data.obstacles),
         },
         rawVersion: jsonDifficultyVer as 4,
         rawData: jsonDifficulty,
         rawLightshow: jsonLightshow,
      };
   });
}

function getNoteContainer(beatmap: types.wrapper.IWrapBeatmap): IObjectContainer[] {
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

function precalculateTimes(beatmap: types.wrapper.IWrapBeatmap, timeProcessor: TimeProcessor) {
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
   return function (object: types.wrapper.IWrapBaseObject) {
      object.customData.__mapcheck_secondtime = timeProcessor.toRealTime(object.time, true);
      object.customData.__mapcheck_beattime = timeProcessor.adjustTime(object.time);
   };
}
