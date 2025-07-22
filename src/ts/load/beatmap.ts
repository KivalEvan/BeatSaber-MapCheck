import JSZip from 'jszip';
import { IBeatmapContainer } from '../types/container';
import { Settings } from '../settings';
import { IObjectContainer, ObjectContainerType } from '../types/container';
import {
   Beatmap,
   calculateScore,
   loadDifficulty,
   loadLightshow,
   logger,
   NoteJumpSpeed,
   resolveGridPosition,
   resolveNoteAngle,
   TimeProcessor,
} from 'bsmap';
import * as types from 'bsmap/types';
import { stats, swing } from 'bsmap/extensions';
import { PrecalculateKey } from '../types/precalculate';
import { isNoteSwingable, isNoteSwingableRaw, noteDistance } from '../utils/beatmap';
import { nearEqual, shortRotDistance } from 'bsmap/utils';

function tag(name: string) {
   return ['load', name];
}

export async function extractLightshow(
   zip: JSZip,
   infoDiff: types.wrapper.IWrapInfoBeatmap,
   path = '',
): Promise<[any, types.wrapper.IWrapBeatmap] | null> {
   const file = zip.file(path + infoDiff.lightshowFilename);
   if (!file) {
      logger.tError(
         tag('extractLightshow'),
         `Missing ${infoDiff.lightshowFilename} lightshow file for ${infoDiff.characteristic} ${infoDiff.difficulty}, ignoring.`,
      );
   }
   logger.tInfo(
      tag('extractLightshow'),
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
         tag('extractLightshow'),
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
            loaded[infoDiff.lightshowFilename] = extractLightshow(zip, infoDiff, path);
         }
         const res = await loaded[infoDiff.lightshowFilename];
         if (res) {
            [jsonLightshow, lightshow] = res;
         }
      }
      data.lightshow = lightshow.lightshow;

      return createBeatmapContainer(
         info,
         infoDiff,
         data,
         jsonDifficulty,
         jsonLightshow,
         jsonDifficultyVer,
      );
   });
}

export function createBeatmapContainer(
   info: types.wrapper.IWrapInfo,
   infoBeatmap: types.wrapper.IWrapInfoBeatmap,
   beatmap: types.wrapper.IWrapBeatmap,
   jsonDifficulty: any,
   jsonLightshow: any,
   version: number,
): IBeatmapContainer {
   const timeProcessor = TimeProcessor.create(
      info.audio.bpm,
      version === 3
         ? [
              ...(beatmap.difficulty.customData.BPMChanges ?? []),
              ...(jsonDifficulty.bpmEvents ?? []).map((be: types.v3.IBPMEvent) => be),
           ]
         : version === 2
           ? (beatmap.difficulty.customData._BPMChanges ??
             beatmap.difficulty.customData._bpmChanges)
           : version === 1
             ? jsonDifficulty._BPMChanges
             : [],
      infoBeatmap.customData?._editorOffset,
   );
   const swingAnalysis = swing.info(
      beatmap,
      timeProcessor,
      infoBeatmap.characteristic,
      infoBeatmap.difficulty,
   );
   precalculateObjects(beatmap, swingAnalysis, timeProcessor);

   const env =
      info.environmentNames.at(infoBeatmap.environmentId) ||
      (infoBeatmap.characteristic === '360Degree' || infoBeatmap.characteristic === '90Degree'
         ? info.environmentBase.allDirections
         : info.environmentBase.normal) ||
      'DefaultEnvironment';

   return {
      info: infoBeatmap,
      environment: env,
      timeProcessor,
      njs: new NoteJumpSpeed(
         timeProcessor.bpm,
         infoBeatmap.njs || NoteJumpSpeed.FallbackNJS[infoBeatmap.difficulty] || 0,
         infoBeatmap.njsOffset,
      ),
      data: beatmap,
      noteContainer: getNoteContainer(beatmap),
      swingAnalysis,
      score: calculateScore(beatmap),
      stats: {
         basicEvents: stats.countEvent(
            beatmap.lightshow.basicEvents,
            beatmap.lightshow.colorBoostEvents,
            env,
         ),
         lightColorEventBoxGroups: stats.countEbg(beatmap.lightshow.lightColorEventBoxGroups, env),
         lightRotationEventBoxGroups: stats.countEbg(
            beatmap.lightshow.lightRotationEventBoxGroups,
            env,
         ),
         lightTranslationEventBoxGroups: stats.countEbg(
            beatmap.lightshow.lightTranslationEventBoxGroups,
            env,
         ),
         fxEventBoxGroups: stats.countEbg(beatmap.lightshow.fxEventBoxGroups, env),
         notes: stats.countNote(beatmap.difficulty.colorNotes),
         bombs: stats.countBomb(beatmap.difficulty.bombNotes),
         arcs: stats.countNote(beatmap.difficulty.arcs),
         chains: stats.countNote(beatmap.difficulty.chains),
         obstacles: stats.countObstacle(beatmap.difficulty.obstacles),
      },
      rawVersion: version as 4,
      rawData: jsonDifficulty,
      rawLightshow: jsonLightshow,
   } satisfies IBeatmapContainer;
}

function getNoteContainer(beatmap: types.wrapper.IWrapBeatmap): IObjectContainer[] {
   return [
      ...beatmap.difficulty.colorNotes.map((e) => ({ data: e, type: ObjectContainerType.COLOR })),
      ...beatmap.difficulty.bombNotes.map((e) => ({ data: e, type: ObjectContainerType.BOMB })),
      ...beatmap.difficulty.chains.map((e) => ({ data: e, type: ObjectContainerType.CHAIN })),
      ...beatmap.difficulty.arcs.map((e) => ({ data: e, type: ObjectContainerType.ARC })),
   ].sort((a, b) => a.data.time - b.data.time) as IObjectContainer[];
}

function precalculateObjects(
   beatmap: types.wrapper.IWrapBeatmap,
   swingAnalysis: swing.types.ISwingAnalysis,
   timeProcessor: TimeProcessor,
) {
   const applyTime = applyTimeFn(timeProcessor);
   if (!beatmap.difficulty.customData[PrecalculateKey.CALCULATED]) {
      beatmap.difficulty.bpmEvents.forEach(applyTime);
      beatmap.difficulty.njsEvents.forEach(applyTime);
      beatmap.difficulty.rotationEvents.forEach(applyTime);

      beatmap.difficulty.colorNotes.forEach(applyTime);
      beatmap.difficulty.colorNotes.forEach(applyPosition);
      beatmap.difficulty.colorNotes.forEach(applyAngle);

      beatmap.difficulty.bombNotes.forEach(applyTime);
      beatmap.difficulty.bombNotes.forEach(applyPosition);

      beatmap.difficulty.obstacles.forEach(applyTime);
      beatmap.difficulty.obstacles.forEach(applyPosition);

      beatmap.difficulty.arcs.forEach(applyTime);
      beatmap.difficulty.arcs.forEach(applyPosition);
      beatmap.difficulty.arcs.forEach(applyAngle);

      beatmap.difficulty.chains.forEach(applyTime);
      beatmap.difficulty.chains.forEach(applyPosition);
      beatmap.difficulty.chains.forEach(applyAngle);

      beatmap.difficulty.customData[PrecalculateKey.CALCULATED] = true;
   }

   if (!beatmap.lightshow.customData[PrecalculateKey.CALCULATED]) {
      beatmap.lightshow.waypoints.forEach(applyTime);
      beatmap.lightshow.basicEvents.forEach(applyTime);
      beatmap.lightshow.colorBoostEvents.forEach(applyTime);
      beatmap.lightshow.lightColorEventBoxGroups.forEach(applyTime);
      beatmap.lightshow.lightRotationEventBoxGroups.forEach(applyTime);
      beatmap.lightshow.lightTranslationEventBoxGroups.forEach(applyTime);
      beatmap.lightshow.fxEventBoxGroups.forEach(applyTime);
      beatmap.lightshow.customData[PrecalculateKey.CALCULATED] = true;
   }

   for (const cont of swingAnalysis.container) {
      if (cont.data.length !== 2) {
         continue;
      }

      if (
         nearEqual(cont.data[0].time, cont.data[1].time) &&
         (cont.data[0].direction !== types.NoteDirection.ANY &&
         cont.data[1].direction !== types.NoteDirection.ANY
            ? resolveNoteAngle(cont.data[0].direction) ===
                 resolveNoteAngle(cont.data[1].direction) &&
              isNoteSwingableRaw(cont.data[0], cont.data[1], 30)
            : true)
      ) {
         const [pX, pY] = cont.data[0].customData[PrecalculateKey.POSITION];
         const [qX, qY] = cont.data[1].customData[PrecalculateKey.POSITION];
         const direction =
            resolveNoteAngle(cont.data[0].direction) || resolveNoteAngle(cont.data[1].direction);
         const angle1 = (Math.atan2(pY - qY, pX - qX) * 180) / Math.PI + 90;
         const angle2 = (Math.atan2(qY - pY, qX - pX) * 180) / Math.PI + 90;

         cont.data[0].customData[PrecalculateKey.ANGLE] = cont.data[1].customData[
            PrecalculateKey.ANGLE
         ] =
            shortRotDistance(direction, angle1, 360) > shortRotDistance(direction, angle2, 360)
               ? angle2
               : angle1;
         cont.data[0].customData[PrecalculateKey.SNAPPED] = cont.data[1].customData[
            PrecalculateKey.SNAPPED
         ] = true;
      }
   }
}

function applyPosition(
   object: types.wrapper.IWrapGridObject & Partial<types.wrapper.IWrapBaseSlider>,
) {
   object.customData[PrecalculateKey.POSITION] = resolveGridPosition(object);
   if (typeof object.tailPosX === 'number' && typeof object.tailPosY === 'number') {
      object.customData[PrecalculateKey.TAIL_POSITION] = [object.tailPosX, object.tailPosY];
   }
}

function applyAngle(
   object: types.wrapper.IWrapBaseNote & { angleOffset?: number } & Partial<types.wrapper.IWrapArc>,
) {
   object.customData[PrecalculateKey.ANGLE] =
      resolveNoteAngle(object.direction) + (object.angleOffset || 0);
   if (object.direction === types.NoteDirection.ANY) {
      object.customData[PrecalculateKey.ANGLE] += 180;
   }
   if (typeof object.tailDirection === 'number') {
      object.customData[PrecalculateKey.TAIL_ANGLE] = resolveNoteAngle(object.tailDirection);
      if (object.tailDirection === types.NoteDirection.ANY) {
         object.customData[PrecalculateKey.TAIL_ANGLE] += 180;
      }
   }
}

function applyTimeFn(timeProcessor: TimeProcessor) {
   return function (object: types.wrapper.IWrapBaseObject) {
      object.customData[PrecalculateKey.SECOND_TIME] = timeProcessor.toRealTime(object.time);
      object.customData[PrecalculateKey.BEAT_TIME] = timeProcessor.adjustTime(object.time);
      if ('tailTime' in object) {
         object.customData[PrecalculateKey.TAIL_SECOND_TIME] = timeProcessor.toRealTime(
            object.tailTime as number,
         );
         object.customData[PrecalculateKey.TAIL_BEAT_TIME] = timeProcessor.adjustTime(
            object.tailTime as number,
         );
      }
      if ('duration' in object) {
         object.customData[PrecalculateKey.DURATION_SECOND_TIME] =
            timeProcessor.toRealTime(object.time + (object.duration as number)) -
            object.customData[PrecalculateKey.SECOND_TIME];
         object.customData[PrecalculateKey.DURATION_BEAT_TIME] = object.duration;
      }
   };
}
