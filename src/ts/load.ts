import JSZip from 'jszip';
import * as swing from './analyzers/swing/mod';
import { BeatPerMinute } from './beatmap/shared/bpm';
import { toV3Difficulty, toV2Info } from './converter/mod';
import { v3Difficulty, v2Difficulty, v1Difficulty, v2Info, v1Info } from './beatmap/parse';
import logger from './logger';
import { IWrapInfo } from './types/beatmap/wrapper/info';
import { IDifficulty as IDifficultyV2 } from './types/beatmap/v2/difficulty';
import { IDifficulty as IDifficultyV3 } from './types/beatmap/v3/difficulty';
import { IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { Either } from './types/utils';

function tag(name: string) {
   return ['load', name];
}

export async function loadInfo(zip: JSZip) {
   const infoFile = zip.file('Info.dat') || zip.file('info.dat');
   if (!infoFile) {
      throw new Error("Couldn't find Info.dat");
   }
   logger.tInfo(tag('loadInfo'), `loading info`);
   return v2Info(JSON.parse(await infoFile.async('string')));
}

export async function loadDifficulty(info: IWrapInfo, zip: JSZip) {
   const beatmapItem: IBeatmapItem[] = [];
   const mapSet = info.difficultySets;
   for (let i = mapSet.length - 1; i >= 0; i--) {
      const mapDiff = mapSet[i].difficulties;
      if (mapDiff.length === 0 || !mapDiff) {
         logger.tError(tag('loadDifficulty'), 'Empty difficulty set, removing...');
         mapSet.splice(i, 1);
         continue;
      }
      for (let j = 0; j < mapDiff.length; j++) {
         const diffInfo = mapDiff[j];
         const diffFile = zip.file(diffInfo.filename as string);
         if (diffFile) {
            logger.tInfo(
               tag('loadDifficulty'),
               `Loading ${mapSet[i].characteristic} ${diffInfo.difficulty}`,
            );
            let diffJSON: Either<IDifficultyV2, IDifficultyV3>;
            try {
               diffJSON = JSON.parse(await diffFile.async('string'));
            } catch (err) {
               throw new Error(`${mapSet[i].characteristic} ${diffInfo.difficulty} ${err}`);
            }
            try {
               // _notes in v2 and version in v3 is required, _version in v2 is patched via mod if does not exist
               if (diffJSON._notes && diffJSON.version) {
                  logger.tError(
                     tag('loadDifficulty'),
                     `${mapSet[i].characteristic} ${diffInfo.difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
                  );
               }
               if (diffJSON.version) {
                  const data = v3Difficulty(diffJSON);
                  const bpm = BeatPerMinute.create(
                     info.beatsPerMinute,
                     [
                        ...(data.customData.BPMChanges ?? []),
                        ...data.bpmEvents.map((be) => be.toJSON()),
                     ],
                     diffInfo.customData?._editorOffset,
                  );
                  beatmapItem.push({
                     info: diffInfo,
                     characteristic: mapSet[i].characteristic,
                     difficulty: diffInfo.difficulty,
                     bpm,
                     data,
                     noteContainer: data.getNoteContainer(),
                     eventContainer: data.getEventContainer(),
                     swingAnalysis: swing.info(
                        data,
                        bpm,
                        mapSet[i].characteristic,
                        diffInfo.difficulty,
                     ),
                     rawVersion: 3,
                     rawData: diffJSON,
                  });
               } else {
                  const data = toV3Difficulty(v2Difficulty(diffJSON));
                  const bpm = BeatPerMinute.create(
                     info.beatsPerMinute,
                     data.customData._BPMChanges ?? data.customData._bpmChanges,
                     diffInfo.customData?._editorOffset,
                  );
                  beatmapItem.push({
                     info: diffInfo,
                     characteristic: mapSet[i].characteristic,
                     difficulty: diffInfo.difficulty,
                     bpm,
                     data,
                     noteContainer: data.getNoteContainer(),
                     eventContainer: data.getEventContainer(),
                     swingAnalysis: swing.info(
                        data,
                        bpm,
                        mapSet[i].characteristic,
                        diffInfo.difficulty,
                     ),
                     rawVersion: 2,
                     rawData: diffJSON,
                  });
               }
            } catch (err) {
               throw new Error(`${mapSet[i].characteristic} ${diffInfo.difficulty} ${err}`);
            }
         } else {
            logger.tError(
               tag('loadDifficulty'),
               `Missing ${diffInfo.filename} file for ${mapSet[i].characteristic} ${diffInfo.difficulty}, ignoring.`,
            );
            mapSet[i].difficulties.splice(j, 1);
            j--;
            if (mapSet[i].difficulties.length < 1) {
               logger.tError(
                  ['load'],
                  `${mapSet[i].characteristic} difficulty set now empty, ignoring.`,
               );
               mapSet.splice(i, 1);
               continue;
            }
         }
      }
   }
   return beatmapItem;
}
