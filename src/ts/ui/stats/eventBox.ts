import { IInfo } from '../../types/beatmap/shared/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { countColorEBG, countRotationEBG, countTranslationEBG } from '../../analyzers/stats/mod';
import { eventGroupRename } from '../../analyzers/renamer/mod';
import { prefix } from './constants';

export function createEBGCountTable(mapInfo: IInfo, mapData: IBeatmapItem): HTMLTableElement {
    const environment =
        mapData.characteristic === '360Degree' || mapData.characteristic === '90Degree'
            ? mapInfo._allDirectionsEnvironmentName
            : mapInfo._environmentName;
    const ebgColorCount = countColorEBG(mapData.data.lightColorEventBoxGroups, environment);
    const ebgRotationCount = countRotationEBG(mapData.data.lightRotationEventBoxGroups, environment);
    const ebgTranslationCount = countTranslationEBG(mapData.data.lightTranslationEventBoxGroups, environment);

    let htmlString = `<caption class="${prefix}table-caption">Color Event Box Groups: <span title="${Object.values(
        ebgColorCount,
    ).reduce((t, { eventBox }) => t + eventBox, 0)} Box (${Object.values(ebgColorCount).reduce(
        (t, { base }) => t + base,
        0,
    )} Base)">${Object.values(ebgColorCount).reduce(
        (t, { total }) => t + total,
        0,
    )}</span><br>Rotation Event Box Groups: <span title="${Object.values(ebgRotationCount).reduce(
        (t, { eventBox }) => t + eventBox,
        0,
    )} Box (${Object.values(ebgRotationCount).reduce((t, { base }) => t + base, 0)} Base)">${Object.values(
        ebgRotationCount,
    ).reduce((t, { total }) => t + total, 0)}</span><br>Translation Event Box Groups: <span title="${Object.values(
        ebgTranslationCount,
    ).reduce((t, { eventBox }) => t + eventBox, 0)} Box (${Object.values(ebgTranslationCount).reduce(
        (t, { base }) => t + base,
        0,
    )} Base)">${Object.values(ebgTranslationCount).reduce((t, { total }) => t + total, 0)}</span></caption>`;

    for (const key in ebgColorCount) {
        htmlString += `<tr><th class="${prefix}table-header">${key}</th><th class="${prefix}table-header" colspan="5">${eventGroupRename(
            parseInt(key),
            environment,
        )}</th><td class="${prefix}table-element" title="${ebgColorCount[key].eventBox} Box (${
            ebgColorCount[key].base
        } Base)">${ebgColorCount[key].total}</td><td class="${prefix}table-element" title="${
            ebgRotationCount[key].eventBox
        } Box (${ebgRotationCount[key].base} Base)">${
            ebgRotationCount[key].total
        }</td><td class="${prefix}table-element" title="${ebgTranslationCount[key].eventBox} Box (${
            ebgTranslationCount[key].base
        } Base)">${ebgTranslationCount[key].total}</td></tr>`;
    }

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;

    return htmlTable;
}
