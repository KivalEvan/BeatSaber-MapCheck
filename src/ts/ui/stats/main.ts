// i hate implementing these so much
import { State } from '../../state';
import { logPrefix } from './constants';
import { UIStatsNPS } from './nps';
import { UIStatsSettings } from './settings';
import { UIStatsSPS } from './sps';
import { UIStatsEvent } from './event';
import { UIStatsEventBox } from './eventBox';
import { UIStatsNoteInfo } from './noteInfo';
import { UIStatsNote } from './note';
import { UIStatsNoteAngle } from './noteAngle';
import { UIStatsNotePlacement } from './notePlacement';
import { UIStatsObstacle } from './obstacle';
import { UISelection } from '../selection';
import * as types from 'bsmap/types';

export class UIStats {
   static init(): void {
      UIStatsSettings.init();
      UIStatsNPS.init();
      UIStatsSPS.init();

      UIStatsNoteInfo.init();
      UIStatsNote.init();
      UIStatsNoteAngle.init();
      UIStatsNotePlacement.init();

      UIStatsEvent.init();
      UIStatsEventBox.init();
      UIStatsObstacle.init();

      UISelection.selectionOnChangeHandlers.push(UIStats.updateStats);
   }

   static updateStats(
      characteristic?: types.CharacteristicName,
      difficulty?: types.DifficultyName,
   ): void {
      if (!State.data.info) {
         throw new Error(logPrefix + 'map info could not be found');
      }
      const beatmapInfo = State.data.info;

      const beatmapItem = State.data.beatmaps.find(
         (bm) => bm.info.characteristic === characteristic && bm.info.difficulty === difficulty,
      );
      if (!beatmapItem) {
         throw new Error(logPrefix + 'Could not find map data');
      }

      UIStatsSettings.updateTable(beatmapInfo, beatmapItem);
      UIStatsNPS.updateTable(beatmapInfo, beatmapItem);
      UIStatsSPS.updateTable(beatmapInfo, beatmapItem);

      UIStatsNoteInfo.updateTable(beatmapInfo, beatmapItem);
      UIStatsNote.updateTable(beatmapInfo, beatmapItem);
      UIStatsNotePlacement.updateTable(beatmapInfo, beatmapItem);
      UIStatsNoteAngle.updateTable(beatmapInfo, beatmapItem);

      UIStatsEvent.updateTable(beatmapInfo, beatmapItem);
      UIStatsEventBox.updateTable(beatmapInfo, beatmapItem);
      UIStatsObstacle.updateTable(beatmapInfo, beatmapItem);
   }
}
