import { formatNumber, round } from '../../utils';
import { IInfo } from '../../types/beatmap/shared/info';
import { IBeatmapItem } from '../../types/mapcheck';
import * as swing from '../../analyzers/swing/mod';
import * as score from '../../analyzers/score';
import { prefix } from './constants';
import { countNote } from '../../analyzers/stats/note';

export function createNoteInfoTable(mapInfo: IInfo, mapData: IBeatmapItem): HTMLTableElement {
    const noteCount = countNote(mapData.data.colorNotes);
    let htmlString = `<caption class="${prefix}table-caption">Note Information:</caption><tr><th class="${prefix}table-header" colspan="2">R/B Ratio</th><td class="${prefix}table-element">${round(
        noteCount.red.total / noteCount.blue.total,
        2,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Max Score</th><td class="${prefix}table-element">${formatNumber(
        score.calculate(mapData.noteContainer),
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM</th><td class="${prefix}table-element">${round(
        swing.getMaxEffectiveBPM(mapData.swingAnalysis.container),
        2,
    )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM (swing)</th><td class="${prefix}table-element">${round(
        swing.getMaxEffectiveBPMSwing(mapData.swingAnalysis.container),
        2,
    )}</td></tr>`;

    let minSpeed = round(swing.getMinSliderSpeed(mapData.swingAnalysis.container) * 1000, 1);
    let maxSpeed = round(swing.getMaxSliderSpeed(mapData.swingAnalysis.container) * 1000, 1);
    if (minSpeed && maxSpeed) {
        htmlString += `<tr><th class="${prefix}table-header" colspan="2">Min. Slider Speed</th><td class="${prefix}table-element">${minSpeed}ms</td></tr><tr><th class="${prefix}table-header" colspan="2">Max. Slider Speed</th><td class="${prefix}table-element">${maxSpeed}ms</td></tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
}
