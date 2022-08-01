import { round } from '../../utils';
import { BeatPerMinute, NoteJumpSpeed } from '../../beatmap';
import { IInfoData } from '../../types/beatmap/shared/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { prefix } from './constants';

export function createSettingsTable(mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement {
    const bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
    const njs = NoteJumpSpeed.create(
        bpm,
        mapData.info._noteJumpMovementSpeed || NoteJumpSpeed.FallbackNJS[mapData.difficulty],
        mapData.info._noteJumpStartBeatOffset,
    );

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = `<caption class="${prefix}table-caption">Map Settings:</caption><tr><th class="${prefix}table-header" colspan="2">Note Jump Speed</th><td class="${prefix}table-element">${round(
        njs.value,
        3,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Spawn Distance Modifier</th><td class="${prefix}table-element">${round(
        njs.offset,
        3,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Half Jump Duration</th><td class="${prefix}table-element">${round(
        njs.hjd,
        3,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Jump Distance</th><td class="${prefix}table-element">${round(
        njs.jd,
        3,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Reaction Time</th><td class="${prefix}table-element">${round(
        njs.reactTime * 1000,
    )}ms</td></tr>`;

    return htmlTable;
}
