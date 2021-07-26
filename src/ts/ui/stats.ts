import * as uiAccordion from './accordion';
import * as uiPanel from './panel';
import * as stats from '../stats';
import savedData from '../savedData';
import { CharacteristicRename } from '../beatmap/characteristic';
import { DifficultyRename } from '../beatmap/difficulty';

const logPrefix = 'UI Stats: ';

const htmlStats = document.querySelector('#stats .accordion__collapsible');

export const clear = (): void => {};

export const populate = (): void => {
    if (!htmlStats) {
        console.error(logPrefix + 'HTML stats does not exist');
        return;
    }
    if (!savedData._mapInfo) {
        throw new Error(logPrefix + 'map info could not be found in savedData');
    }
    if (!savedData._mapData) {
        throw new Error(logPrefix + 'map data could not be found in savedData');
    }
    savedData._mapInfo._difficultyBeatmapSets.forEach((set) => {
        const htmlContainer = document.createElement('div');
        htmlContainer.className = 'stats__mode-' + set._beatmapCharacteristicName;

        const htmlTitle = document.createElement('div');
        htmlTitle.className = 'stats__title';
        htmlTitle.textContent = CharacteristicRename[set._beatmapCharacteristicName];
        htmlContainer.appendChild(htmlTitle);

        set._difficultyBeatmaps.forEach((diff) => {
            const htmlAccordion = uiAccordion.create(
                `stats__${set._beatmapCharacteristicName}-${diff._difficulty}`,
                DifficultyRename[diff._difficulty],
                true
            );

            const htmlContent = htmlAccordion.querySelector('.accordion__collapsible-flex');
            if (!htmlContent) {
                throw new Error(logPrefix + 'Something went wrong!');
            }

            const mapData = savedData._mapData?.find(
                (data) =>
                    data._mode === set._beatmapCharacteristicName &&
                    data._difficulty === diff._difficulty
            );
            if (!mapData) {
                throw new Error(logPrefix + 'Could not find map data');
            }

            const htmlPanel = uiPanel.create('tiny', 'half');
            htmlPanel.textContent = stats.nps
                .calculate(mapData._data._notes, savedData._duration)
                .toString();
            htmlContent.appendChild(htmlPanel);
            htmlContainer.appendChild(htmlAccordion);
        });

        htmlStats.appendChild(htmlContainer);
    });
};

export const reset = (): void => {};
