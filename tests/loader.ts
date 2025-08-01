import { CharacteristicName, DifficultyName, external, LooseAutocomplete } from 'bsmap/types';
import { createBeatmapContainer } from '../src/ts/load';
import { CheckArgs } from '../src/ts/types';
import { logger, readFromInfoSync, readInfoFileSync } from 'bsmap';
import { readdirSync, readFileSync } from 'fs';
import { cachedKeyedComponents } from '../src/ts/checks/components';

logger.setLevel(0);

const cachedInfo = readInfoFileSync('./tests/resources/Test Track/Info.dat');
const cachedBeatmaps = readFromInfoSync(cachedInfo, {
   directory: './tests/resources/Test Track/',
});
const cachedBookmarks: Record<string, number[][]> = {};

for (const file of readdirSync('./tests/resources/Test Track/Bookmarks', {
   withFileTypes: true,
}).filter((f) => f.isFile())) {
   const data = JSON.parse(
      readFileSync(`./tests/resources/Test Track/Bookmarks/${file.name}`, 'utf-8'),
   ) as external.IBookmarks;
   cachedBookmarks[data.characteristic + data.difficulty] = [];

   data.bookmarks
      .sort((a, b) => a.beat - b.beat)
      .forEach((b) => {
         const label = b.label.split('-')[0];
         for (const k of label) {
            if (k === ' ') break;
            if (k.match(/[1-9]/)) {
               cachedBookmarks[data.characteristic + data.difficulty][parseInt(k) - 1] ||= [];
               cachedBookmarks[data.characteristic + data.difficulty][parseInt(k) - 1].push(b.beat);
            }
         }
      });
}

const map: {
   [k in LooseAutocomplete<keyof typeof cachedKeyedComponents>]?: [
      CharacteristicName,
      DifficultyName,
   ];
} = {
   handclap: ['Standard', 'ExpertPlus'],
   hitboxInline: ['Standard', 'Expert'],
   hitboxPath: ['Standard', 'Hard'],
   hitboxStair: ['Standard', 'Normal'],
   hitboxReverseStair: ['Standard', 'Easy'],

   acceptablePrec: ['OneSaber', 'ExpertPlus'],
   doubleDirectional: ['OneSaber', 'Expert'],
   parity: ['OneSaber', 'Hard'],
   excessiveDouble: ['OneSaber', 'Normal'],
   parallelNotes: ['OneSaber', 'Easy'],

   improperArc: ['NoArrows', 'ExpertPlus'],
   improperChain: ['NoArrows', 'Expert'],
   improperWindow: ['NoArrows', 'Hard'],
   angleOffset: ['NoArrows', 'Normal'],
   hammerHit: ['NoArrows', 'Easy'],

   effectiveBPM: ['360Degree', 'ExpertPlus'],
   speedPause: ['360Degree', 'Expert'],
   slowSlider: ['360Degree', 'Hard'],
   varySwing: ['360Degree', 'Normal'],
   stackedNote: ['360Degree', 'Easy'],

   visionBlock: ['90Degree', 'ExpertPlus'],
   centerObstacle: ['90Degree', 'Expert'],
   rankableObstacle: ['90Degree', 'Hard'],
   shortObstacle: ['90Degree', 'Normal'],
   zeroObstacle: ['90Degree', 'Easy'],

   insufficientLight1: ['Legacy', 'ExpertPlus'],
   insufficientLight2: ['Legacy', 'Expert'],
   invalidEventBox: ['Legacy', 'Hard'],
   unlitBomb: ['Legacy', 'Normal'],
   vnjs: ['Legacy', 'Easy'],

   invalidObjectNoteBomb: ['Lightshow', 'ExpertPlus'],
   invalidObjectChainArc: ['Lightshow', 'Expert'],
   invalidObjectObstacle: ['Lightshow', 'Hard'],
   invalidObjectEvent: ['Lightshow', 'Normal'],
   invalidObjectGls: ['Lightshow', 'Easy'],

   hotStart: ['Lawless', 'ExpertPlus'],
   outro1: ['Lawless', 'Expert'],
   outro2: ['Lawless', 'Hard'],
   outsidePlayable: ['Lawless', 'Normal'],
};

export function getInput(
   checkName: LooseAutocomplete<keyof typeof cachedKeyedComponents>,
): [input: CheckArgs, expect: number[][]] {
   const result = cachedBeatmaps.find(
      (b) =>
         b.info.characteristic === map[checkName]![0] && b.info.difficulty === map[checkName]![1],
   );
   if (!result) throw new Error('could not find map');

   return [
      {
         audioDuration: 32,
         mapDuration: 32,
         beatmap: createBeatmapContainer(
            cachedInfo,
            result.info,
            result.beatmap,
            undefined,
            undefined,
            result.beatmap.version,
         ),
         info: cachedInfo,
      },
      cachedBookmarks[map[checkName]![0] + map[checkName]![1]],
   ];
}
