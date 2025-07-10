import JSZip from 'jszip';
import { IBeatmapContainer } from '../types/checks/container';
import { Settings } from '../settings';
import { IObjectContainer, ObjectContainerType } from '../types/checks/container';
import {
   Beatmap,
   calculateScore,
   loadDifficulty,
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

async function fetchLightshow(
   zip: JSZip,
   infoDiff: types.wrapper.IWrapInfoBeatmap,
   path = '',
): Promise<[any, types.wrapper.IWrapBeatmap] | null> {
   const file = zip.file(path + infoDiff.lightshowFilename);
   if (!file) {
      logger.tError(
         tag('fetchLightshow'),
         `Missing ${infoDiff.lightshowFilename} lightshow file for ${infoDiff.characteristic} ${infoDiff.difficulty}, ignoring.`,
      );
   }
   logger.tInfo(
      tag('fetchLightshow'),
      `Loading ${infoDiff.characteristic} ${infoDiff.difficulty} lightshow`,
   );
   try {
      const json = await file!.async('string').then(JSON.parse);
      const lightshow = loadLightshow(json, {
         sort: Settings.props.sorting,
         schemaCheck: { enabled: Settings.props.dataCheck },
      });
      return [json, lightshow];
   } catch (err) {
      logger.tError(
         tag('fetchLightshow'),
         `Could not load ${infoDiff.lightshowFilename} lightshow file; ${err}`,
      );
   }
   return null;
}

export function extractBeatmaps(
   info: types.wrapper.IWrapInfo,
   zip: JSZip,
   path = '',
): Promise<IBeatmapContainer | null>[] {
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
         sort: Settings.props.sorting,
         schemaCheck: { enabled: Settings.props.dataCheck },
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
                 ...(data.difficulty.customData.BPMChanges ?? []),
                 ...(jsonDifficulty.bpmEvents ?? []).map((be: types.v3.IBPMEvent) => be),
              ]
            : jsonDifficultyVer === 2
              ? (data.difficulty.customData._BPMChanges ?? data.difficulty.customData._bpmChanges)
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
         info: infoDiff,
         environment: env,
         timeProcessor,
         njs: new NoteJumpSpeed(
            timeProcessor.bpm,
            infoDiff.njs || NoteJumpSpeed.FallbackNJS[infoDiff.difficulty] || 0,
            infoDiff.njsOffset,
         ),
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
            basicEvents: stats.countEvent(
               data.lightshow.basicEvents,
               data.lightshow.colorBoostEvents,
               env,
            ),
            lightColorEventBoxGroups: stats.countEbg(data.lightshow.lightColorEventBoxGroups, env),
            lightRotationEventBoxGroups: stats.countEbg(
               data.lightshow.lightRotationEventBoxGroups,
               env,
            ),
            lightTranslationEventBoxGroups: stats.countEbg(
               data.lightshow.lightTranslationEventBoxGroups,
               env,
            ),
            fxEventBoxGroups: stats.countEbg(data.lightshow.fxEventBoxGroups, env),
            notes: stats.countNote(data.difficulty.colorNotes),
            bombs: stats.countBomb(data.difficulty.bombNotes),
            arcs: stats.countNote(data.difficulty.arcs),
            chains: stats.countNote(data.difficulty.chains),
            obstacles: stats.countObstacle(data.difficulty.obstacles),
         },
         rawVersion: jsonDifficultyVer as 4,
         rawData: jsonDifficulty,
         rawLightshow: jsonLightshow,
      } satisfies IBeatmapContainer;
   });
}

function getNoteContainer(beatmap: types.wrapper.IWrapBeatmap): IObjectContainer[] {
   return [
      ...beatmap.difficulty.colorNotes.map((e) => ({ data: e, type: ObjectContainerType.COLOR })),
      ...beatmap.difficulty.bombNotes.map((e) => ({ data: e, type: ObjectContainerType.BOMB })),
      ...beatmap.difficulty.chains.map((e) => ({ data: e, type: ObjectContainerType.CHAIN })),
      ...beatmap.difficulty.arcs.map((e) => ({ data: e, type: ObjectContainerType.ARC })),
   ].sort((a, b) => a.data.time - b.data.time) as IObjectContainer[];
}

function precalculateTimes(beatmap: types.wrapper.IWrapBeatmap, timeProcessor: TimeProcessor) {
   const fn = applyTime(timeProcessor);
   if (!beatmap.difficulty.customData.__mapcheck_precalculatetime) {
      beatmap.difficulty.bpmEvents.forEach(fn);
      beatmap.difficulty.rotationEvents.forEach(fn);
      beatmap.difficulty.colorNotes.forEach(fn);
      beatmap.difficulty.bombNotes.forEach(fn);
      beatmap.difficulty.obstacles.forEach(fn);
      beatmap.difficulty.arcs.forEach(fn);
      beatmap.difficulty.chains.forEach(fn);
      beatmap.difficulty.customData.__mapcheck_precalculatetime = true;
   }

   if (!beatmap.lightshow.customData.__mapcheck_precalculatetimelightshow) {
      beatmap.lightshow.waypoints.forEach(fn);
      beatmap.lightshow.basicEvents.forEach(fn);
      beatmap.lightshow.colorBoostEvents.forEach(fn);
      beatmap.lightshow.lightColorEventBoxGroups.forEach(fn);
      beatmap.lightshow.lightRotationEventBoxGroups.forEach(fn);
      beatmap.lightshow.lightTranslationEventBoxGroups.forEach(fn);
      beatmap.lightshow.fxEventBoxGroups.forEach(fn);
      beatmap.lightshow.customData.__mapcheck_precalculatetimelightshow = true;
   }
}

function applyTime(timeProcessor: TimeProcessor) {
   return function (object: types.wrapper.IWrapBaseObject) {
      object.customData.__mapcheck_secondtime = timeProcessor.toRealTime(object.time);
      object.customData.__mapcheck_beattime = timeProcessor.adjustTime(object.time);
      if ('tailTime' in object) {
         object.customData.__mapcheck_tail_secondtime = timeProcessor.toRealTime(
            object.tailTime as number,
         );
         object.customData.__mapcheck_tail_beattime = timeProcessor.adjustTime(
            object.tailTime as number,
         );
      }
      if ('duration' in object) {
         object.customData.__mapcheck_duration_secondtime =
            timeProcessor.toRealTime(object.time + (object.duration as number)) -
            object.customData.__mapcheck_secondtime;
         object.customData.__mapcheck_duration_beattime = object.duration;
      }
   };
}
