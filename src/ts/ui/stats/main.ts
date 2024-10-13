// i hate implementing these so much
import LoadedData from '../../loadedData';
import { logPrefix } from './constants';
import { updateNPSTable } from './nps';
import { updateSettingsTable } from './settings';
import { updateSPSTable } from './sps';
import { updateNoteAngleTable } from './noteAngle';
import { updateEventCountTable } from './event';
import { updateEBGCountTable } from './eventBox';
import { updateNoteInfoTable } from './noteInfo';
import { updateNoteCountTable } from './note';
import { updateNotePlacementTable } from './notePlacement';
import { updateObstacleCountTable } from './obstacle';
import { selectionOnChangeHandlers } from '../selection';
import * as types from 'bsmap/types';

function updateStats(
   characteristic?: types.CharacteristicName,
   difficulty?: types.DifficultyName,
): void {
   if (!LoadedData.beatmapInfo) {
      throw new Error(logPrefix + 'map info could not be found in loadedData');
   }
   const beatmapInfo = LoadedData.beatmapInfo;

   const beatmapItem = LoadedData.beatmaps.find(
      (bm) =>
         bm.settings.characteristic === characteristic && bm.settings.difficulty === difficulty,
   );
   if (!beatmapItem) {
      throw new Error(logPrefix + 'Could not find map data');
   }

   updateSettingsTable(beatmapInfo, beatmapItem);
   updateNPSTable(beatmapInfo, beatmapItem);
   updateSPSTable(beatmapInfo, beatmapItem);

   updateNoteInfoTable(beatmapInfo, beatmapItem);
   updateNoteCountTable(beatmapInfo, beatmapItem);
   updateNotePlacementTable(beatmapInfo, beatmapItem);
   updateNoteAngleTable(beatmapInfo, beatmapItem);

   updateEventCountTable(beatmapInfo, beatmapItem);
   updateEBGCountTable(beatmapInfo, beatmapItem);
   updateObstacleCountTable(beatmapInfo, beatmapItem);
}

selectionOnChangeHandlers.push(updateStats);
