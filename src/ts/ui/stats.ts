// i hate implementing these so much
import UIAccordion from './helpers/accordion';
import UIPanel from './helpers/panel';
import UISelect from './helpers/select';
import SavedData from '../savedData';
import Settings from '../settings';
import { formatNumber, round } from '../utils';
import { BeatPerMinute, NoteJumpSpeed, DifficultyRename } from '../beatmap';
import { CharacteristicRename } from '../beatmap/shared/characteristic';
import { IInfoData } from '../types';
import { IBeatmapItem } from '../types/mapcheck';
import { NoteContainer } from '../types/beatmap/v3/container';
import { countBomb, countDirection, countNote, countX, countXY, countY } from '../analyzers/stats/note';
import * as swing from '../analyzers/swing';
import { countObstacle } from '../analyzers/stats/obstacle';
import { countColorEBG, countEvent, countRotationEBG } from '../analyzers/stats';
import * as score from '../analyzers/score';
import { eventGroupRename, eventTypeRename } from '../analyzers/environment/renamer';

const logPrefix = 'UI Stats: ';
const prefix = 'stats__';
const htmlStats: HTMLElement = document.querySelector('#stats .accordion__collapsible')!;

const createSettingsTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
    const njs = NoteJumpSpeed.create(
        bpm,
        mapData.info._noteJumpMovementSpeed || NoteJumpSpeed.FallbackNJS[mapData.difficulty],
        mapData.info._noteJumpStartBeatOffset,
    );

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = `<caption class="${prefix}table-caption">Map Settings:</caption>
    <tr>
    <th class="${prefix}table-header" colspan="2">Note Jump Speed</th>
    <td class="${prefix}table-element">${round(njs.value, 3)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Spawn Distance Modifier</th>
    <td class="${prefix}table-element">${round(njs.offset, 3)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Half Jump Duration</th>
    <td class="${prefix}table-element">${round(njs.hjd, 3)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Jump Distance</th>
    <td class="${prefix}table-element">${round(njs.jd, 3)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Reaction Time</th>
    <td class="${prefix}table-element">${round(njs.reactTime * 1000)}ms</td>
    </tr>`;

    return htmlTable;
};

const createNPSTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
    const duration = SavedData.duration || 0;
    const mapDuration = bpm.toRealTime(mapData.data.getLastInteractiveTime());

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = `<caption class="${prefix}table-caption">Note Per Seconds (NPS):</caption>
    <tr>
    <th class="${prefix}table-header" colspan="2">Overall</th>
    <td class="${prefix}table-element">${round(mapData.data.nps(duration), 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Mapped</th>
    <td class="${prefix}table-element">${round(mapData.data.nps(mapDuration), 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" rowspan="3">Peak</th>
    <th class="${prefix}table-header">16-beat</th>
    <td class="${prefix}table-element">${round(mapData.data.peak(16, bpm.value), 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">8-beat</th>
    <td class="${prefix}table-element">${round(mapData.data.peak(8, bpm.value), 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">4-beat</th>
    <td class="${prefix}table-element">${round(mapData.data.peak(4, bpm.value), 2)}</td>
    </tr>`;

    return htmlTable;
};

const createSPSTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const swingInfo = mapData.swingAnalysis;

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = `<caption class="${prefix}table-caption">Swing Per Seconds (SPS):</caption>
    <tr>
    <th class="${prefix}table-header"></th>
    <th class="${prefix}table-header">Total</th>
    <th class="${prefix}table-header">Red</th>
    <th class="${prefix}table-header">Blue</th>
    </tr>
    <tr>
    <th class="${prefix}table-header">Count</th>
    <td class="${prefix}table-element">${round(swingInfo.total.count, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.red.count, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.blue.count, 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Median</th>
    <td class="${prefix}table-element">${round(swingInfo.total.median, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.red.median, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.blue.median, 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Peak</th>
    <td class="${prefix}table-element">${round(swingInfo.total.peak, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.red.peak, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.blue.peak, 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Total</th>
    <td class="${prefix}table-element">${swingInfo.total.total}</td>
    <td class="${prefix}table-element">${swingInfo.red.total}</td>
    <td class="${prefix}table-element">${swingInfo.blue.total}</td>
    </tr>`;

    return htmlTable;
};

const createNoteCountTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const noteCount = countNote(mapData.data.colorNotes);
    const arcCount = countNote(mapData.data.sliders);
    const chainCount = countNote(mapData.data.burstSliders);
    const bombCount = countBomb(mapData.data.bombNotes);

    let htmlString = `<caption class="${prefix}table-caption">Notes: ${
        noteCount.red.total + noteCount.blue.total
    }<br>Arc: ${arcCount.red.total + arcCount.blue.total}<br>Chain: ${
        chainCount.red.total + chainCount.blue.total
    }<br>Bombs: ${noteCount.red.total + noteCount.blue.total}<br>R/B Ratio: ${round(
        noteCount.red.total / noteCount.blue.total,
        2,
    )}</caption>
    <tr>
    <th class="${prefix}table-header"></th>
    <th class="${prefix}table-header">Red</th>
    <th class="${prefix}table-header">Blue</th>
    <th class="${prefix}table-header">Bomb</th>
    </tr>
    <tr>
    <th class="${prefix}table-header">Note</th>
    <td class="${prefix}table-element">${noteCount.red.total}</td>
    <td class="${prefix}table-element">${noteCount.blue.total}</td>
    <td class="${prefix}table-element">0</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Arc</th>
    <td class="${prefix}table-element">${arcCount.red.total}</td>
    <td class="${prefix}table-element">${arcCount.blue.total}</td>
    <td class="${prefix}table-element">0</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Chain</th>
    <td class="${prefix}table-element">${chainCount.red.total}</td>
    <td class="${prefix}table-element">${chainCount.blue.total}</td>
    <td class="${prefix}table-element">0</td>
    </tr>
    <tr>
    <th class="${prefix}table-header">Bomb</th>
    <td class="${prefix}table-element">0</td>
    <td class="${prefix}table-element">0</td>
    <td class="${prefix}table-element">${bombCount.total}</td>
    </tr>`;
    if (noteCount.red.chroma || noteCount.blue.chroma || bombCount.chroma) {
        htmlString += `<tr>
        <th class="${prefix}table-header">Chroma</th>
        <td class="${prefix}table-element">${noteCount.red.chroma}</td>
        <td class="${prefix}table-element">${noteCount.blue.chroma}</td>
        <td class="${prefix}table-element">${bombCount.chroma}</td>
        </tr>`;
    }
    if (noteCount.red.noodleExtensions || noteCount.blue.noodleExtensions || bombCount.noodleExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header">NE</th>
        <td class="${prefix}table-element">${noteCount.red.noodleExtensions}</td>
        <td class="${prefix}table-element">${noteCount.blue.noodleExtensions}</td>
        <td class="${prefix}table-element">${bombCount.noodleExtensions}</td>
        </tr>`;
    }
    if (noteCount.red.mappingExtensions || noteCount.blue.mappingExtensions || bombCount.mappingExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header">ME</th>
        <td class="${prefix}table-element">${noteCount.red.mappingExtensions}</td>
        <td class="${prefix}table-element">${noteCount.blue.mappingExtensions}</td>
        <td class="${prefix}table-element">${bombCount.mappingExtensions}</td>
        </tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
};

function notePlacementSelectHandler(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    const id = target.id.replace(`${prefix}table-select-placement-`, '').split('-');

    const mode = id[0];
    const diff = id[1];
    const noteContainer = SavedData.beatmapDifficulty.find(
        (set) => set.characteristic === mode && set.difficulty === diff,
    )?.noteContainer;
    if (!noteContainer) {
        console.error(logPrefix + 'note could not be found');
        return;
    }
    let filteredContainer!: NoteContainer[];
    switch (target.value) {
        case 'note': {
            filteredContainer = noteContainer.filter((n) => n.type === 'note');
            break;
        }
        case 'red': {
            filteredContainer = noteContainer.filter((n) => n.type === 'note' && n.data.color === 0);
            break;
        }
        case 'blue': {
            filteredContainer = noteContainer.filter((n) => n.type === 'note' && n.data.color === 1);
            break;
        }
        case 'bomb': {
            filteredContainer = noteContainer.filter((n) => n.type === 'bomb');
            break;
        }
        default: {
            filteredContainer = noteContainer;
        }
    }
    const htmlTableBody = document.querySelector(`#${prefix}table-placement-${mode}-${diff}`);
    if (!htmlTableBody) {
        console.error(logPrefix + 'table could not be found');
        return;
    }
    htmlTableBody.innerHTML = notePlacementTableString(filteredContainer);
}

const notePlacementTableString = (nc: NoteContainer[]): string => {
    const totalNote = nc.length || 1;
    let htmlString = '';
    for (let l = 2; l >= 0; l--) {
        htmlString += '<tr>';
        for (let i = 0; i <= 3; i++) {
            htmlString += `<td class="${prefix}table-element">${countXY(nc, i, l)}</td>`;
        }
        htmlString += `<td class="${prefix}table-element ${prefix}table--no-border">${round(
            (countY(nc, l) / totalNote) * 100,
            1,
        )}%</td>
        </tr>`;
    }
    htmlString += `<tr>
    <td class="${prefix}table-element ${prefix}table--no-border">${round((countX(nc, 0) / totalNote) * 100, 1)}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round((countX(nc, 1) / totalNote) * 100, 1)}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round((countX(nc, 2) / totalNote) * 100, 1)}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round((countX(nc, 3) / totalNote) * 100, 1)}%</td>
    </tr>`;
    return htmlString;
};

const createNotePlacementTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const htmlSelect = UISelect.create(
        `${prefix}table-select-placement-${mapData.characteristic}-${mapData.difficulty}`,
        'Note Placement: ',
        'caption',
        `${prefix}table-caption`,
        { text: 'All', value: 'all' },
        { text: 'Note Only', value: 'note' },
        { text: 'Red Note', value: 'red' },
        { text: 'Blue Note', value: 'blue' },
        { text: 'Bomb', value: 'bomb' },
    );
    htmlSelect.querySelector<HTMLSelectElement>('select')?.addEventListener('change', notePlacementSelectHandler);

    let htmlString = `<tbody id="${prefix}table-placement-${mapData.characteristic}-${
        mapData.difficulty
    }">${notePlacementTableString(mapData.noteContainer)}</tbody>`;

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;
    htmlTable.prepend(htmlSelect);

    return htmlTable;
};

function noteAngleSelectHandler(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    const id = target.id.replace(`${prefix}table-select-angle-`, '').split('-');

    const mode = id[0];
    const diff = id[1];
    const noteContainer = SavedData.beatmapDifficulty.find(
        (set) => set.characteristic === mode && set.difficulty === diff,
    )?.noteContainer;
    if (!noteContainer) {
        console.error(logPrefix + 'note could not be found');
        return;
    }
    let filteredContainer!: NoteContainer[];
    switch (target.value) {
        case 'red': {
            filteredContainer = noteContainer.filter((n: NoteContainer) => n.type === 'note' && n.data.color === 0);
            break;
        }
        case 'blue': {
            filteredContainer = noteContainer.filter((n: NoteContainer) => n.type === 'note' && n.data.color === 1);
            break;
        }
        default: {
            filteredContainer = noteContainer;
        }
    }
    const htmlTableBody = document.querySelector(`#${prefix}table-angle-${mode}-${diff}`);
    if (!htmlTableBody) {
        console.error(logPrefix + 'table could not be found');
        return;
    }
    htmlTableBody.innerHTML = noteAngleTableString(filteredContainer);
}

// TODO: use angle instead of cut direction
const noteAngleTableString = (notes: NoteContainer[]): string => {
    const totalNote = notes.length || 1;
    const cutOrder = [4, 0, 5, 2, 8, 3, 6, 1, 7];
    let htmlString = '';
    for (let i = 0; i < 3; i++) {
        htmlString += '<tr>';
        for (let j = 0; j < 3; j++) {
            let count = countDirection(notes, cutOrder[i * 3 + j]);
            htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
                (count / totalNote) * 100,
                1,
            )}%)</td>`;
        }
        htmlString += `</tr>`;
    }
    return htmlString;
};

const createNoteAngleTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const htmlSelect = UISelect.create(
        `${prefix}table-select-angle-${mapData.characteristic}-${mapData.difficulty}`,
        'Note Angle: ',
        'caption',
        `${prefix}table-caption`,
        { text: 'All', value: 'all' },
        { text: 'Note Only', value: 'note' },
        { text: 'Red Note', value: 'red' },
        { text: 'Blue Note', value: 'blue' },
    );
    htmlSelect.querySelector<HTMLSelectElement>('select')?.addEventListener('change', noteAngleSelectHandler);

    let htmlString = `<tbody id="${prefix}table-angle-${mapData.characteristic}-${
        mapData.difficulty
    }">${noteAngleTableString(mapData.noteContainer)}</tbody>`;

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;
    htmlTable.prepend(htmlSelect);

    return htmlTable;
};

const createInfoTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    let htmlString = `<caption class="${prefix}table-caption">Note Information:</caption>
    <tr>
    <th class="${prefix}table-header" colspan="2">Max Score</th>
    <td class="${prefix}table-element">${formatNumber(score.calculate(mapData.noteContainer))}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Effective BPM</th>
    <td class="${prefix}table-element">${round(swing.getMaxEffectiveBPM(mapData.swingAnalysis.container), 2)}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Effective BPM (swing)</th>
    <td class="${prefix}table-element">${round(swing.getMaxEffectiveBPMSwing(mapData.swingAnalysis.container), 2)}</td>
    </tr>`;

    let minSpeed = round(swing.getMinSliderSpeed(mapData.swingAnalysis.container) * 1000, 1);
    let maxSpeed = round(swing.getMaxSliderSpeed(mapData.swingAnalysis.container) * 1000, 1);
    if (minSpeed && maxSpeed) {
        htmlString += `
        <tr>
        <th class="${prefix}table-header" colspan="2">Min. Slider Speed</th>
        <td class="${prefix}table-element">${minSpeed}ms</td>
        </tr>
        <tr>
        <th class="${prefix}table-header" colspan="2">Max. Slider Speed</th>
        <td class="${prefix}table-element">${maxSpeed}ms</td>
        </tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
};

const createEventCountTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const environment =
        mapData.characteristic === '360Degree' || mapData.characteristic === '90Degree'
            ? mapInfo._allDirectionsEnvironmentName
            : mapInfo._environmentName;
    const eventCount = countEvent(mapData.data.basicBeatmapEvents, environment);
    let chroma = 0;
    let chromaOld = 0;
    let noodleExtensions = 0;
    let mappingExtensions = 0;

    let htmlString = `<caption class="${prefix}table-caption">Events: ${Object.values(eventCount).reduce(
        (t, { total }) => t + total,
        0,
    )}</caption>`;

    for (const key in eventCount) {
        chroma += eventCount[key].chroma;
        chromaOld += eventCount[key].chromaOld;
        htmlString += `<tr>
        <th class="${prefix}table-header">${key}</th>
        <th class="${prefix}table-header" colspan="4">${eventTypeRename(parseInt(key), environment)}</th>
        <td class="${prefix}table-element">${eventCount[key].total}</td>
        </tr>`;
    }
    if (chroma) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="5">Chroma</th>
        <td class="${prefix}table-element">${chroma}</td>
        </tr>`;
    }
    if (chromaOld) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="5">OG Chroma</th>
        <td class="${prefix}table-element">${chromaOld}</td>
        </tr>`;
    }
    if (noodleExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="5">Noodle Extensions</th>
        <td class="${prefix}table-element">${noodleExtensions}</td>
        </tr>`;
    }
    if (mappingExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="5">Mapping Extensions</th>
        <td class="${prefix}table-element">${mappingExtensions}</td>
        </tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
};

const createEBGColorCountTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const environment =
        mapData.characteristic === '360Degree' || mapData.characteristic === '90Degree'
            ? mapInfo._allDirectionsEnvironmentName
            : mapInfo._environmentName;
    const ebgColorCount = countColorEBG(mapData.data.lightColorEventBoxGroups, environment);
    const ebgRotationCount = countRotationEBG(mapData.data.lightRotationEventBoxGroups, environment);

    let htmlString = `<caption class="${prefix}table-caption">Color Event Box Groups: ${Object.values(
        ebgColorCount,
    ).reduce((t, { total }) => t + total, 0)}<br>Rotation Event Box Groups: ${Object.values(ebgRotationCount).reduce(
        (t, { total }) => t + total,
        0,
    )}</caption>`;

    for (const key in ebgColorCount) {
        htmlString += `<tr>
        <th class="${prefix}table-header">${key}</th>
        <th class="${prefix}table-header" colspan="4">${eventGroupRename(parseInt(key), environment)}</th>
        <td class="${prefix}table-element">${ebgColorCount[key].total}</td>
        <td class="${prefix}table-element">${ebgRotationCount[key].total}</td>
        </tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
};

const createObstacleCountTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
    const obstacleCount = countObstacle(mapData.data.obstacles);

    let htmlString = `<caption class="${prefix}table-caption">Obstacles: ${obstacleCount.total}</caption>`;
    if (obstacleCount.interactive) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Interactive</th>
        <td class="${prefix}table-element">${obstacleCount.interactive}</td>
        </tr>`;
    }
    if (obstacleCount.chroma) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Chroma</th>
        <td class="${prefix}table-element">${obstacleCount.chroma}</td>
        </tr>`;
    }
    if (obstacleCount.noodleExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Noodle Extensions</th>
        <td class="${prefix}table-element">${obstacleCount.noodleExtensions}</td>
        </tr>`;
    }
    if (obstacleCount.mappingExtensions) {
        htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Mapping Extensions</th>
        <td class="${prefix}table-element">${obstacleCount.mappingExtensions}</td>
        </tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
};

const populate = (): void => {
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

            htmlPanelM.append(createInfoTable(mapInfo, mapData));
            htmlPanelM.append(document.createElement('br'));
            htmlPanelM.append(createNotePlacementTable(mapInfo, mapData));
            htmlPanelM.append(document.createElement('br'));
            htmlPanelM.append(createNoteAngleTable(mapInfo, mapData));

            htmlPanelR.append(createNoteCountTable(mapInfo, mapData));
            htmlPanelR.append(document.createElement('br'));
            htmlPanelR.append(createEventCountTable(mapInfo, mapData));
            htmlPanelR.append(document.createElement('br'));
            htmlPanelR.append(createEBGColorCountTable(mapInfo, mapData));
            htmlPanelR.append(document.createElement('br'));
            htmlPanelR.append(createObstacleCountTable(mapInfo, mapData));

            htmlContent.appendChild(htmlPanelL);
            htmlContent.appendChild(htmlPanelM);
            htmlContent.appendChild(htmlPanelR);
            htmlContainer.appendChild(htmlAccordion);
        }

        htmlStats.appendChild(htmlContainer);
    });
};

const reset = (): void => {
    while (htmlStats.firstChild) {
        htmlStats.removeChild(htmlStats.firstChild);
    }
};

export default {
    createSettingsTable,
    createNPSTable,
    createSPSTable,
    createNoteCountTable,
    createNotePlacementTable,
    createNoteAngleTable,
    createInfoTable,
    createEventCountTable,
    createObstacleCountTable,
    populate,
    reset,
};
