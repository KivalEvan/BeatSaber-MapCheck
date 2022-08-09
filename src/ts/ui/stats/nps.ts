import SavedData from '../../savedData';
import { round } from '../../utils';
import { BeatPerMinute } from '../../beatmap';
import { IInfoData } from '../../types';
import { IBeatmapItem } from '../../types/mapcheck';
import { prefix } from './constants';

export function createNPSTable(mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement {
    const bpm = mapData.bpm;
    const duration = SavedData.duration || 0;
    const mapDuration = bpm.toRealTime(mapData.data.getLastInteractiveTime());

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = `<caption class="${prefix}table-caption">Note Per Seconds (NPS):</caption><tr><th class="${prefix}table-header" colspan="2">Overall</th><td class="${prefix}table-element">${round(
        mapData.data.nps(duration),
        2,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Mapped</th><td class="${prefix}table-element">${round(
        mapData.data.nps(mapDuration),
        2,
    )}</td></tr><tr><th class="${prefix}table-header" rowspan="3">Peak</th><th class="${prefix}table-header">16-beat</th><td class="${prefix}table-element">${round(
        mapData.data.peak(16, bpm.value),
        2,
    )}</td></tr><tr><th class="${prefix}table-header">8-beat</th><td class="${prefix}table-element">${round(
        mapData.data.peak(8, bpm.value),
        2,
    )}</td></tr><tr><th class="${prefix}table-header">4-beat</th><td class="${prefix}table-element">${round(
        mapData.data.peak(4, bpm.value),
        2,
    )}</td></tr>`;

    return htmlTable;
}
