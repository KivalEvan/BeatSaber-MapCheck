// i hate implementing these so much
import UIAccordion from '../helpers/accordion';
import UIPanel from '../helpers/panel';
import SavedData from '../../savedData';
import Settings from '../../settings';
import { DifficultyRename } from '../../beatmap/shared/difficulty';
import { CharacteristicRename } from '../../beatmap/shared/characteristic';
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
import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { IWrapInfoDifficulty } from '../../types/beatmap/wrapper/info';

const htmlStats: HTMLElement = document.querySelector('#stats .accordion__collapsible')!;

function populate(): void {
   if (!SavedData.beatmapInfo) {
      throw new Error(logPrefix + 'map info could not be found in savedData');
   }
   const mapInfo = SavedData.beatmapInfo;

   const diffSet: Partial<Record<CharacteristicName, IWrapInfoDifficulty[]>> = {};
   for (const difficulty of mapInfo.difficulties) {
      diffSet[difficulty.characteristic] ||= [];
      diffSet[difficulty.characteristic]!.push(difficulty);
   }
   for (const set in diffSet) {
      const htmlContainer = document.createElement('div');
      htmlContainer.className = prefix + 'mode-' + set;

      const htmlTitle = document.createElement('div');
      htmlTitle.className = prefix + 'title';
      htmlTitle.textContent = CharacteristicRename[set as CharacteristicName] || set;
      // if (set.customData._characteristicLabel)
      //    htmlTitle.textContent += ` -- ${set.customData._characteristicLabel}`;
      htmlContainer.appendChild(htmlTitle);

      const diffList = diffSet[set as CharacteristicName]!;
      for (let i = diffList.length - 1; i >= 0; i--) {
         const diff = diffList[i];
         const mapData = SavedData.beatmapDifficulty.find(
            (data) => data.characteristic === set && data.difficulty === diff.difficulty,
         );
         if (!mapData) {
            throw new Error(logPrefix + 'Could not find map data');
         }

         const htmlAccordion = UIAccordion.create(
            `${prefix}${set}-${diff.difficulty}`,
            DifficultyRename[diff.difficulty as 'Easy'] +
               (diff.customData._difficultyLabel ? ' -- ' + diff.customData._difficultyLabel : ''),
            diff.difficulty,
            true,
         );

         const htmlContent = htmlAccordion.querySelector('.accordion__collapsible-flex')!;
         const htmlCheckbox = htmlAccordion.querySelector<HTMLInputElement>('.accordion__button')!;
         htmlCheckbox.checked = Settings.onLoad.stats;

         const htmlPanelL = UIPanel.create('small', 'half');
         const htmlPanelM = UIPanel.create('small', 'half');
         const htmlPanelR = UIPanel.create('small', 'half');

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
         htmlContainer.appendChild(htmlAccordion);
      }

      htmlStats.appendChild(htmlContainer);
   }
}

function reset(): void {
   while (htmlStats.firstChild) {
      htmlStats.removeChild(htmlStats.firstChild);
   }
}

export {
   createSettingsTable,
   createNPSTable,
   createSPSTable,
   createNoteCountTable,
   createNotePlacementTable,
   createNoteAngleTable,
   createNoteInfoTable as createInfoTable,
   createEventCountTable,
   createObstacleCountTable,
   populate,
   reset,
};
