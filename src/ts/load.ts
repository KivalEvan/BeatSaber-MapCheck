import JSZip from 'jszip';
import * as swing from './bsmap/extensions/swing/mod';
import { TimeProcessor } from './bsmap/beatmap/helpers/timeProcessor';
import logger from './bsmap/logger';
import { IWrapInfo } from './bsmap/types/beatmap/wrapper/info';
import { IBeatmapAudio, IBeatmapItem } from './types/tools/beatmapItem';
import { IBPMInfo } from './bsmap/types/beatmap/v2/bpmInfo';
import { IAudio } from './bsmap/types/beatmap/v4/audioData';
import { IBPMEvent } from './bsmap/types/beatmap/v3/bpmEvent';
import settings from './settings';
import { Beatmap, loadDifficulty, loadInfo, loadLightshow, toV4Beatmap } from './bsmap/beatmap/mod';
import { IWrapBeatmap } from './bsmap/types/beatmap/wrapper/beatmap';
import { INoteContainer, NoteContainerType } from './types/tools/container';

function tag(name: string) {
   return ['load', name];
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
   return infoFile.async('string').then(JSON.parse).then(loadInfo);
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
         let data = loadDifficulty(jsonDifficulty);
         let lightshow = jsonDifficultyVer === 4 ? new Beatmap() : data;
         let jsonLightshow;
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
            try {
               jsonLightshow = await lightshowFile!.async('string').then(JSON.parse);
               lightshow = loadLightshow(jsonLightshow);
            } catch (err) {
               logger.tError(
                  tag('extractBeatmaps'),
                  `Could not load ${diffInfo.lightshowFilename} lightshow file; ${err}`,
               );
            }
         }
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
            diffInfo.customData?._editorOffset,
         );
         data = data;
         data.lightshow = lightshow.lightshow;
         if (settings.sorting) {
            data.sort();
            lightshow.sort();
         }
         return {
            settings: diffInfo,
            environment: info.environmentNames.at(diffInfo.environmentId)!,
            timeProcessor,
            data,
            noteContainer: getNoteContainer(data, timeProcessor),
            swingAnalysis: swing.info(
               data,
               timeProcessor,
               diffInfo.characteristic,
               diffInfo.difficulty,
            ),
            rawVersion: jsonDifficultyVer as 4,
            rawData: jsonDifficulty,
            rawLightshow: jsonLightshow,
         };
      } catch (err) {
         throw err;
      }
   });
}
function getNoteContainer(beatmap: IWrapBeatmap, timeProcessor: TimeProcessor): INoteContainer[] {
   return [
      ...beatmap.colorNotes.map((e) => ({
         beatTime: timeProcessor.toBeatTime(e.time, true),
         secondTime: timeProcessor.toRealTime(e.time, true),
         data: e,
         type: NoteContainerType.COLOR,
      })),
      ...beatmap.bombNotes.map((e) => ({
         beatTime: timeProcessor.toBeatTime(e.time, true),
         secondTime: timeProcessor.toRealTime(e.time, true),
         data: e,
         type: NoteContainerType.BOMB,
      })),
      ...beatmap.chains.map((e) => ({
         beatTime: timeProcessor.toBeatTime(e.time, true),
         secondTime: timeProcessor.toRealTime(e.time, true),
         data: e,
         type: NoteContainerType.CHAIN,
      })),
      ...beatmap.arcs.map((e) => ({
         beatTime: timeProcessor.toBeatTime(e.time, true),
         secondTime: timeProcessor.toRealTime(e.time, true),
         data: e,
         type: NoteContainerType.ARC,
      })),
   ].sort((a, b) => a.data.time - b.data.time) as INoteContainer[];
}
