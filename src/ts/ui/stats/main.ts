// i hate implementing these so much
import UIAccordion from '../helpers/accordion';
import UIPanel from '../helpers/panel';
import SavedData from '../../savedData';
import Settings from '../../settings';
import { DifficultyRename } from '../../beatmap';
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

const htmlStats: HTMLElement = document.querySelector('#stats .accordion__collapsible')!;

function populate(): void {
    if (!SavedData.beatmapInfo) {
        throw new Error(logPrefix + 'map info could not be found in savedData');
    }
    const mapInfo = SavedData.beatmapInfo;

    mapInfo._difficultyBeatmapSets.forEach((set) => {
        const htmlContainer = document.createElement('div');
        htmlContainer.className = prefix + 'mode-' + set._beatmapCharacteristicName;

        const htmlTitle = document.createElement('div');
        htmlTitle.className = prefix + 'title';
        htmlTitle.textContent = CharacteristicRename[set._beatmapCharacteristicName];
        htmlContainer.appendChild(htmlTitle);

        for (let i = set._difficultyBeatmaps.length - 1; i >= 0; i--) {
            const diff = set._difficultyBeatmaps[i];
            const mapData = SavedData.beatmapDifficulty.find(
                (data) =>
                    data.characteristic === set._beatmapCharacteristicName && data.difficulty === diff._difficulty,
            );
            if (!mapData) {
                throw new Error(logPrefix + 'Could not find map data');
            }

            const htmlAccordion = UIAccordion.create(
                `${prefix}${set._beatmapCharacteristicName}-${diff._difficulty}`,
                DifficultyRename[diff._difficulty] +
                    (diff._customData?._difficultyLabel ? ' -- ' + diff._customData?._difficultyLabel : ''),
                diff._difficulty,
                true,
            );

            const htmlContent = htmlAccordion.querySelector('.accordion__collapsible-flex');
            const htmlCheckbox = htmlAccordion.querySelector<HTMLInputElement>('.accordion__button');
            if (!htmlContent || !htmlCheckbox) {
                throw new Error(logPrefix + 'something went wrong!');
            }
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
    });
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
