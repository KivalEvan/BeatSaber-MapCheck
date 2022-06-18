import { IInfoData } from '../../types';
import { IBeatmapItem } from '../../types/mapcheck';
import { countEvent } from '../../analyzers/stats';
import { eventTypeRename } from '../../analyzers/renamer';
import { prefix } from './constants';

export function createEventCountTable(mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement {
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
        htmlString += `<tr><th class="${prefix}table-header">${key}</th><th class="${prefix}table-header" colspan="4">${eventTypeRename(
            parseInt(key),
            environment,
        )}</th><td class="${prefix}table-element">${eventCount[key].total}</td></tr>`;
    }
    if (chroma) {
        htmlString += `<tr><th class="${prefix}table-header" colspan="5">Chroma</th><td class="${prefix}table-element">${chroma}</td></tr>`;
    }
    if (chromaOld) {
        htmlString += `<tr><th class="${prefix}table-header" colspan="5">OG Chroma</th><td class="${prefix}table-element">${chromaOld}</td></tr>`;
    }
    if (noodleExtensions) {
        htmlString += `<tr><th class="${prefix}table-header" colspan="5">Noodle Extensions</th><td class="${prefix}table-element">${noodleExtensions}</td></tr>`;
    }
    if (mappingExtensions) {
        htmlString += `<tr><th class="${prefix}table-header" colspan="5">Mapping Extensions</th><td class="${prefix}table-element">${mappingExtensions}</td></tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
}
