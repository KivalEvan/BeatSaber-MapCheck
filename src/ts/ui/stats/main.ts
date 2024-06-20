// i hate implementing these so much
import UIPanel from '../helpers/panel';
import LoadedData from '../../loadedData';
import Settings from '../../settings';
import { DifficultyRename } from '../../bsmap/beatmap/shared/difficulty';
import { CharacteristicRename } from '../../bsmap/beatmap/shared/characteristic';
import { logPrefix, prefix } from './constants';
import { createNPSTable } from './nps';
import { createSettingsTable } from './settings';
import { createSPSTable } from './sps';
import { createNoteAngleTable } from './noteAngle';
import { createEventCountTable } from './event';
import { createEBGCountTable } from './eventBox';
import { createNoteInfoTable } from './noteInfo';
import { createNoteCountTable } from './note';
import { createNotePlacementTable } from './notePlacement';
import { createObstacleCountTable } from './obstacle';
import { CharacteristicName } from '../../bsmap/types/beatmap/shared/characteristic';
import { IWrapInfoBeatmap } from '../../bsmap/types/beatmap/wrapper/info';
import { getSelectedCharacteristic, getSelectedDifficulty } from '../selection';

const htmlStats: HTMLElement = document.querySelector('.stats__content')!;

function populate(): void {
   if (!LoadedData.beatmapInfo) {
      throw new Error(logPrefix + 'map info could not be found in loadedData');
   }
   const mapInfo = LoadedData.beatmapInfo;

   const diffSet: Partial<Record<CharacteristicName, IWrapInfoBeatmap[]>> = {};
   for (const difficulty of mapInfo.difficulties) {
      diffSet[difficulty.characteristic] ||= [];
      diffSet[difficulty.characteristic]!.push(difficulty);
   }

   const htmlContainer = document.createElement('div');
   const characteristic = getSelectedCharacteristic();
   const difficulty = getSelectedDifficulty();
   const mapData = LoadedData.beatmaps.find(
      (bm) =>
         bm.settings.characteristic === characteristic && bm.settings.difficulty === difficulty,
   );
   if (!mapData) {
      throw new Error(logPrefix + 'Could not find map data');
   }

   const htmlPanelL = UIPanel.create('small', 'half');
   const htmlPanelM = UIPanel.create('small', 'half');
   const htmlPanelR = UIPanel.create('small', 'half');
   const htmlContent = document.createElement('div');

   htmlStats.innerHTML = '';

   htmlPanelL.append(createSettingsTable(mapInfo, mapData));
   htmlPanelL.append(document.createElement('br'));
   htmlPanelL.append(createNPSTable(mapInfo, mapData));
   htmlPanelL.append(document.createElement('br'));
   htmlPanelL.append(createSPSTable(mapInfo, mapData));

   htmlPanelM.append(createNoteInfoTable(mapInfo, mapData));
   htmlPanelM.append(document.createElement('br'));
   htmlPanelM.append(createNoteCountTable(mapInfo, mapData));
   htmlPanelM.append(document.createElement('br'));
   htmlPanelM.append(createNotePlacementTable(mapInfo, mapData));
   htmlPanelM.append(document.createElement('br'));
   htmlPanelM.append(createNoteAngleTable(mapInfo, mapData));

   htmlPanelR.append(createEventCountTable(mapInfo, mapData));
   htmlPanelR.append(document.createElement('br'));
   htmlPanelR.append(createEBGCountTable(mapInfo, mapData));
   htmlPanelR.append(document.createElement('br'));
   htmlPanelR.append(createObstacleCountTable(mapInfo, mapData));

   htmlContent.appendChild(htmlPanelL);
   htmlContent.appendChild(htmlPanelM);
   htmlContent.appendChild(htmlPanelR);
   htmlContainer.appendChild(htmlContent);

   htmlStats.appendChild(htmlContainer);
}

function reset(): void {
   while (htmlStats.firstChild) {
      htmlStats.removeChild(htmlStats.firstChild);
   }
}

export {
   createEventCountTable,
   createNoteAngleTable,
   createNoteCountTable,
   createNoteInfoTable,
   createNotePlacementTable,
   createNPSTable,
   createObstacleCountTable,
   createSettingsTable,
   createSPSTable,
   populate,
   reset,
};
