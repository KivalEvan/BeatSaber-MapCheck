// i hate implementing these so much
import uiAccordion from './accordion';
import uiPanel from './panel';
import uiSelect from './select';
import savedData from '../savedData';
import settings from '../settings';
import { formatNumber, round } from '../utils';
import { BeatPerMinute, NoteJumpSpeed, DifficultyRename } from '../beatmap';
import { CharacteristicRename } from '../beatmap/shared/characteristic';
import { ColorNote } from '../beatmap/v3';
import { IInfoData } from '../types';
import { EventRename } from '../types/beatmap/v2';
import { IBeatmapItem } from '../types/mapcheck';
import { Obstacle } from '../beatmap/v3';

const logPrefix = 'UI Stats: ';
const prefix = 'stats__';
export default new (class UIStats {
    private htmlStats: HTMLElement;

    constructor() {
        this.htmlStats = document.querySelector('#stats .accordion__collapsible')!;
    }

    createSettingsTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
        const njs = NoteJumpSpeed.create(
            bpm,
            mapData.info._noteJumpMovementSpeed ||
                NoteJumpSpeed.FallbackNJS[mapData.difficulty],
            mapData.info._noteJumpStartBeatOffset
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

    createNPSTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
        const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
        const duration = savedData.duration || 0;
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
    <td class="${prefix}table-element">${round(
            mapData.data.peak(16, bpm.value),
            2
        )}</td>
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

    createSPSTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
        const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
        const swingInfo = swing.info(mapData.data, bpm);

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
    <th class="${prefix}table-header">Overall</th>
    <td class="${prefix}table-element">${round(swingInfo.total.overall, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.red.overall, 2)}</td>
    <td class="${prefix}table-element">${round(swingInfo.blue.overall, 2)}</td>
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

    createNoteCountTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const noteCount = note.count(mapData.data._notes);

        let htmlString = `<caption class="${prefix}table-caption">Notes: ${
            noteCount.red.total + noteCount.blue.total
        }<br>R/B Ratio: ${round(
            noteCount.red.total / noteCount.blue.total,
            2
        )}</caption>
    <tr>
    <th class="${prefix}table-header"></th>
    <th class="${prefix}table-header">Red</th>
    <th class="${prefix}table-header">Blue</th>
    <th class="${prefix}table-header">Bomb</th>
    </tr>
    <tr>
    <th class="${prefix}table-header">Total</th>
    <td class="${prefix}table-element">${noteCount.red.total}</td>
    <td class="${prefix}table-element">${noteCount.blue.total}</td>
    <td class="${prefix}table-element">${noteCount.bomb.total}</td>
    </tr>`;
        if (noteCount.red.chroma || noteCount.blue.chroma || noteCount.bomb.chroma) {
            htmlString += `<tr>
        <th class="${prefix}table-header">Chroma</th>
        <td class="${prefix}table-element">${noteCount.red.chroma}</td>
        <td class="${prefix}table-element">${noteCount.blue.chroma}</td>
        <td class="${prefix}table-element">${noteCount.bomb.chroma}</td>
        </tr>`;
        }
        if (
            noteCount.red.noodleExtensions ||
            noteCount.blue.noodleExtensions ||
            noteCount.bomb.noodleExtensions
        ) {
            htmlString += `<tr>
        <th class="${prefix}table-header">NE</th>
        <td class="${prefix}table-element">${noteCount.red.noodleExtensions}</td>
        <td class="${prefix}table-element">${noteCount.blue.noodleExtensions}</td>
        <td class="${prefix}table-element">${noteCount.bomb.noodleExtensions}</td>
        </tr>`;
        }
        if (
            noteCount.red.mappingExtensions ||
            noteCount.blue.mappingExtensions ||
            noteCount.bomb.mappingExtensions
        ) {
            htmlString += `<tr>
        <th class="${prefix}table-header">ME</th>
        <td class="${prefix}table-element">${noteCount.red.mappingExtensions}</td>
        <td class="${prefix}table-element">${noteCount.blue.mappingExtensions}</td>
        <td class="${prefix}table-element">${noteCount.bomb.mappingExtensions}</td>
        </tr>`;
        }

        const htmlTable = document.createElement('table');
        htmlTable.className = prefix + 'table';
        htmlTable.innerHTML = htmlString;

        return htmlTable;
    };

    private notePlacementSelectHandler = (ev: Event) => {
        const target = ev.target as HTMLSelectElement;
        const id = target.id.replace(`${prefix}table-select-placement-`, '').split('-');

        const mode = id[0];
        const diff = id[1];
        const data = savedData.beatmapDifficulty.find(
            (set) => set.characteristic === mode && set.difficulty === diff
        )?.data;
        if (!data) {
            console.error(logPrefix + 'note could not be found');
            return;
        }
        let filteredNotes!: ColorNote[];
        switch (target.value) {
            case 'note': {
                filteredNotes = notes.filter((n) => n._type === 0);
                break;
            }
            case 'red': {
                filteredNotes = notes.filter((n) => n._type === 0);
                break;
            }
            case 'blue': {
                filteredNotes = notes.filter((n) => n._type === 1);
                break;
            }
            case 'bomb': {
                filteredNotes = notes.filter((n) => n._type === 3);
                break;
            }
            default: {
                filteredNotes = notes;
            }
        }
        const htmlTableBody = document.querySelector(
            `#${prefix}table-placement-${mode}-${diff}`
        );
        if (!htmlTableBody) {
            console.error(logPrefix + 'table could not be found');
            return;
        }
        htmlTableBody.innerHTML = this.notePlacementTableString(filteredNotes);
    };

    private notePlacementTableString = (notes: ColorNote[]): string => {
        const totalNote = notes.length || 1;
        let htmlString = '';
        for (let l = 2; l >= 0; l--) {
            htmlString += '<tr>';
            for (let i = 0; i <= 3; i++) {
                htmlString += `<td class="${prefix}table-element">${note.countIndexLayer(
                    notes,
                    i,
                    l
                )}</td>`;
            }
            htmlString += `<td class="${prefix}table-element ${prefix}table--no-border">${round(
                (note.countLayer(notes, l) / totalNote) * 100,
                1
            )}%</td>
        </tr>`;
        }
        htmlString += `<tr>
    <td class="${prefix}table-element ${prefix}table--no-border">${round(
            (note.countIndex(notes, 0) / totalNote) * 100,
            1
        )}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round(
            (note.countIndex(notes, 1) / totalNote) * 100,
            1
        )}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round(
            (note.countIndex(notes, 2) / totalNote) * 100,
            1
        )}%</td>
    <td class="${prefix}table-element ${prefix}table--no-border">${round(
            (note.countIndex(notes, 3) / totalNote) * 100,
            1
        )}%</td>
    </tr>`;
        return htmlString;
    };

    createNotePlacementTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const htmlSelect = uiSelect.create(
            `${prefix}table-select-placement-${mapData.characteristic}-${mapData.difficulty}`,
            'Note Placement: ',
            'caption',
            `${prefix}table-caption`,
            { text: 'All', value: 'all' },
            { text: 'Note Only', value: 'note' },
            { text: 'Red Note', value: 'red' },
            { text: 'Blue Note', value: 'blue' },
            { text: 'Bomb', value: 'bomb' }
        );
        htmlSelect
            .querySelector<HTMLSelectElement>('select')
            ?.addEventListener('change', this.notePlacementSelectHandler);

        let htmlString = `<tbody id="${prefix}table-placement-${
            mapData.characteristic
        }-${mapData.difficulty}">${notePlacementTableString(
            mapData.data._notes
        )}</tbody>`;

        const htmlTable = document.createElement('table');
        htmlTable.className = prefix + 'table';
        htmlTable.innerHTML = htmlString;
        htmlTable.prepend(htmlSelect);

        return htmlTable;
    };

    private noteAngleSelectHandler = (ev: Event) => {
        const target = ev.target as HTMLSelectElement;
        const id = target.id.replace(`${prefix}table-select-angle-`, '').split('-');

        const mode = id[0];
        const diff = id[1];
        const notes = savedData.beatmapDifficulty.find(
            (set) => set.characteristic === mode && set.difficulty === diff
        )?._data._notes;
        if (!notes) {
            console.error(logPrefix + 'note could not be found');
            return;
        }
        let filteredNotes!: ColorNote[];
        switch (target.value) {
            case 'note': {
                filteredNotes = notes.filter((n: ColorNote) => note.isNote(n));
                break;
            }
            case 'red': {
                filteredNotes = notes.filter((n: ColorNote) => n._type === 0);
                break;
            }
            case 'blue': {
                filteredNotes = notes.filter((n: ColorNote) => n._type === 1);
                break;
            }
            case 'bomb': {
                filteredNotes = notes.filter((n: ColorNote) => n._type === 3);
                break;
            }
            default: {
                filteredNotes = notes;
            }
        }
        const htmlTableBody = document.querySelector(
            `#${prefix}table-angle-${mode}-${diff}`
        );
        if (!htmlTableBody) {
            console.error(logPrefix + 'table could not be found');
            return;
        }
        htmlTableBody.innerHTML = this.noteAngleTableString(filteredNotes);
    };

    // TODO: use angle instead of cut direction
    private noteAngleTableString = (notes: ColorNote[]): string => {
        const totalNote = notes.length || 1;
        const cutOrder = [4, 0, 5, 2, 8, 3, 6, 1, 7];
        let htmlString = '';
        for (let i = 0; i < 3; i++) {
            htmlString += '<tr>';
            for (let j = 0; j < 3; j++) {
                let count = note.countDirection(notes, cutOrder[i * 3 + j]);
                htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
                    (count / totalNote) * 100,
                    1
                )}%)</td>`;
            }
            htmlString += `</tr>`;
        }
        return htmlString;
    };

    createNoteAngleTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const htmlSelect = uiSelect.create(
            `${prefix}table-select-angle-${mapData.characteristic}-${mapData.difficulty}`,
            'Note Angle: ',
            'caption',
            `${prefix}table-caption`,
            { text: 'All', value: 'all' },
            { text: 'Note Only', value: 'note' },
            { text: 'Red Note', value: 'red' },
            { text: 'Blue Note', value: 'blue' },
            { text: 'Bomb', value: 'bomb' }
        );
        htmlSelect
            .querySelector<HTMLSelectElement>('select')
            ?.addEventListener('change', this.noteAngleSelectHandler);

        let htmlString = `<tbody id="${prefix}table-angle-${mapData.characteristic}-${
            mapData.difficulty
        }">${this.noteAngleTableString(mapData.data._notes)}</tbody>`;

        const htmlTable = document.createElement('table');
        htmlTable.className = prefix + 'table';
        htmlTable.innerHTML = htmlString;
        htmlTable.prepend(htmlSelect);

        return htmlTable;
    };

    createInfoTable = (mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement => {
        const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
        const noteCount = note.count(mapData.data._notes);

        let htmlString = `<caption class="${prefix}table-caption">Note Information:</caption>
    <tr>
    <th class="${prefix}table-header" colspan="2">Max Score</th>
    <td class="${prefix}table-element">${formatNumber(
            score.calculate(noteCount.red.total + noteCount.blue.total)
        )}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Effective BPM</th>
    <td class="${prefix}table-element">${round(
            swing.getMaxEffectiveBPM(mapData.data._notes, bpm),
            2
        )}</td>
    </tr>
    <tr>
    <th class="${prefix}table-header" colspan="2">Effective BPM (swing)</th>
    <td class="${prefix}table-element">${round(
            swing.getMaxEffectiveBPMSwing(mapData.data._notes, bpm),
            2
        )}</td>
    </tr>`;

        let minSpeed = round(
            swing.getMinSliderSpeed(mapData.data._notes, bpm) * 1000,
            1
        );
        let maxSpeed = round(
            swing.getMaxSliderSpeed(mapData.data._notes, bpm) * 1000,
            1
        );
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

    createEventCountTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const eventCount = event.count(mapData.data._events, mapData.environment);
        let chroma = 0;
        let chromaOld = 0;
        let noodleExtensions = 0;
        let mappingExtensions = 0;

        let htmlString = `<caption class="${prefix}table-caption">Events: ${Object.values(
            eventCount
        ).reduce((t, { total }) => t + total, 0)}</caption>`;

        for (const key in eventCount) {
            chroma += eventCount[key].chroma;
            chromaOld += eventCount[key].chromaOld;
            noodleExtensions += eventCount[key].noodleExtensions;
            mappingExtensions += eventCount[key].mappingExtensions;
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">${EventRename[key]}</th>
        <td class="${prefix}table-element">${eventCount[key].total}</td>
        </tr>`;
        }
        if (chroma) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Chroma</th>
        <td class="${prefix}table-element">${chroma}</td>
        </tr>`;
        }
        if (chromaOld) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">OG Chroma</th>
        <td class="${prefix}table-element">${chromaOld}</td>
        </tr>`;
        }
        if (noodleExtensions) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Noodle Extensions</th>
        <td class="${prefix}table-element">${noodleExtensions}</td>
        </tr>`;
        }
        if (mappingExtensions) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Mapping Extensions</th>
        <td class="${prefix}table-element">${mappingExtensions}</td>
        </tr>`;
        }

        const htmlTable = document.createElement('table');
        htmlTable.className = prefix + 'table';
        htmlTable.innerHTML = htmlString;

        return htmlTable;
    };

    createObstacleCountTable = (
        mapInfo: IInfoData,
        mapData: IBeatmapItem
    ): HTMLTableElement => {
        const obstacleCount = Obstacle.count(mapData.data.obstacles);

        let htmlString = `<caption class="${prefix}table-caption">Obstacles: ${obstacleCount.total}</caption>`;
        if (obstacleCount.interactive) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Interactive</th>
        <td class="${prefix}table-element">${obstacleCount.interactive}</td>
        </tr>`;
        }
        if (obstacleCount.crouch) {
            htmlString += `<tr>
        <th class="${prefix}table-header" colspan="2">Crouch</th>
        <td class="${prefix}table-element">${obstacleCount.crouch}</td>
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

    populate = (): void => {
        if (!savedData.beatmapInfo) {
            throw new Error(logPrefix + 'map info could not be found in savedData');
        }
        const mapInfo = savedData.beatmapInfo;

        mapInfo._difficultyBeatmapSets.forEach((set) => {
            const htmlContainer = document.createElement('div');
            htmlContainer.className = prefix + 'mode-' + set._beatmapCharacteristicName;

            const htmlTitle = document.createElement('div');
            htmlTitle.className = prefix + 'title';
            htmlTitle.textContent =
                CharacteristicRename[set._beatmapCharacteristicName];
            htmlContainer.appendChild(htmlTitle);

            set._difficultyBeatmaps.forEach((diff) => {
                const mapData = savedData.beatmapDifficulty.find(
                    (data) =>
                        data.characteristic === set._beatmapCharacteristicName &&
                        data.difficulty === diff._difficulty
                );
                if (!mapData) {
                    throw new Error(logPrefix + 'Could not find map data');
                }

                const htmlAccordion = uiAccordion.create(
                    `${prefix}${set._beatmapCharacteristicName}-${diff._difficulty}`,
                    DifficultyRename[diff._difficulty] +
                        (diff._customData?.difficultyLabel
                            ? ' -- ' + diff._customData?.difficultyLabel
                            : ''),
                    diff._difficulty,
                    true
                );

                const htmlContent = htmlAccordion.querySelector(
                    '.accordion__collapsible-flex'
                );
                const htmlCheckbox =
                    htmlAccordion.querySelector<HTMLInputElement>('.accordion__button');
                if (!htmlContent || !htmlCheckbox) {
                    throw new Error(logPrefix + 'something went wrong!');
                }
                htmlCheckbox.checked = settings.onLoad.stats;

                const htmlPanelL = uiPanel.create('small', 'half');
                const htmlPanelM = uiPanel.create('small', 'half');
                const htmlPanelR = uiPanel.create('small', 'half');

                htmlPanelL.append(this.createSettingsTable(mapInfo, mapData));
                htmlPanelL.append(document.createElement('br'));
                htmlPanelL.append(this.createNPSTable(mapInfo, mapData));
                htmlPanelL.append(document.createElement('br'));
                htmlPanelL.append(this.createSPSTable(mapInfo, mapData));

                htmlPanelM.append(this.createInfoTable(mapInfo, mapData));
                htmlPanelM.append(document.createElement('br'));
                htmlPanelM.append(this.createNotePlacementTable(mapInfo, mapData));
                htmlPanelM.append(document.createElement('br'));
                htmlPanelM.append(this.createNoteAngleTable(mapInfo, mapData));

                htmlPanelR.append(this.createNoteCountTable(mapInfo, mapData));
                htmlPanelR.append(document.createElement('br'));
                htmlPanelR.append(this.createEventCountTable(mapInfo, mapData));
                htmlPanelR.append(document.createElement('br'));
                htmlPanelR.append(this.createObstacleCountTable(mapInfo, mapData));

                htmlContent.appendChild(htmlPanelL);
                htmlContent.appendChild(htmlPanelM);
                htmlContent.appendChild(htmlPanelR);
                htmlContainer.appendChild(htmlAccordion);
            });

            this.htmlStats.appendChild(htmlContainer);
        });
    };

    reset = (): void => {
        if (!this.htmlStats) {
            console.error(logPrefix + 'HTML stats does not exist');
            return;
        }
        while (this.htmlStats.firstChild) {
            this.htmlStats.removeChild(this.htmlStats.firstChild);
        }
    };
})();
