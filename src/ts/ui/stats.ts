import * as uiAccordion from './accordion';
import * as uiPanel from './panel';
import * as beatmap from '../beatmap';
import savedData from '../savedData';
import { round } from '../utils';

const logPrefix = 'UI Stats: ';
const prefix = 'stats__';

const htmlStats = document.querySelector('#stats .accordion__collapsible');

export const clear = (): void => {};

// TODO: may god forgive me, i'll replace them with smaller function later
export const populate = (): void => {
    if (!htmlStats) {
        console.error(logPrefix + 'HTML stats does not exist');
        return;
    }
    if (!savedData._mapInfo) {
        throw new Error(logPrefix + 'map info could not be found in savedData');
    }
    if (!savedData._mapSet) {
        throw new Error(logPrefix + 'map data could not be found in savedData');
    }
    savedData._mapInfo._difficultyBeatmapSets.forEach((set) => {
        const htmlContainer = document.createElement('div');
        htmlContainer.className = prefix + 'mode-' + set._beatmapCharacteristicName;

        const htmlTitle = document.createElement('div');
        htmlTitle.className = prefix + 'title';
        htmlTitle.textContent =
            beatmap.characteristic.CharacteristicRename[set._beatmapCharacteristicName];
        htmlContainer.appendChild(htmlTitle);

        set._difficultyBeatmaps.forEach((diff) => {
            const htmlAccordion = uiAccordion.create(
                `${prefix}${set._beatmapCharacteristicName}-${diff._difficulty}`,
                beatmap.difficulty.DifficultyRename[diff._difficulty] +
                    (diff._customData?._difficultyLabel
                        ? ' -- ' + diff._customData?._difficultyLabel
                        : ''),
                diff._difficulty,
                true
            );

            const htmlContent = htmlAccordion.querySelector('.accordion__collapsible-flex');
            if (!htmlContent) {
                throw new Error(logPrefix + 'Something went wrong!');
            }

            const mapData = savedData._mapSet?.find(
                (data) =>
                    data._mode === set._beatmapCharacteristicName &&
                    data._difficulty === diff._difficulty
            );
            if (!mapData) {
                throw new Error(logPrefix + 'Could not find map data');
            }

            const htmlPanelL = uiPanel.create('tiny', 'half');
            const htmlPanelML = uiPanel.create('tiny', 'half');
            const htmlPanelMR = uiPanel.create('tiny', 'half');
            const htmlPanelR = uiPanel.create('tiny', 'half');

            const htmlTable = document.createElement('table');
            htmlTable.innerHTML = `<caption>Note Per Seconds:</caption>
            <tr>
            <th colspan="2">Overall</th>
            <td>${round(beatmap.note.calculate(mapData._data._notes, savedData._duration), 2)}</td>
            </tr>
            <tr>
            <th colspan="2">Mapped</th>
            <td>${round(beatmap.note.calculate(mapData._data._notes, savedData._duration), 2)}</td>
            </tr>`;

            htmlPanelML.append(htmlTable);

            htmlContent.appendChild(htmlPanelL);
            htmlContent.appendChild(htmlPanelML);
            htmlContent.appendChild(htmlPanelMR);
            htmlContent.appendChild(htmlPanelR);
            htmlContainer.appendChild(htmlAccordion);
        });

        htmlStats.appendChild(htmlContainer);
    });
};

export const reset = (): void => {};
