import JSZip from 'jszip';
import { IBeatmapAudio } from '../types/checks/container';
import { logger } from 'bsmap';
import * as types from 'bsmap/types';

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
