import { IInfo } from '../../types/beatmap/shared/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { countEbg } from '../../analyzers/stats/mod';
import { eventGroupRename } from '../../analyzers/renamer/mod';
import { prefix } from './constants';

export function createEBGCountTable(mapInfo: IInfo, mapData: IBeatmapItem): HTMLDivElement {
    const environment =
        mapData.characteristic === '360Degree' || mapData.characteristic === '90Degree'
            ? mapInfo._allDirectionsEnvironmentName
            : mapInfo._environmentName;
    const ebgColorCount = countEbg(mapData.data.lightColorEventBoxGroups, environment);
    const ebgRotationCount = countEbg(mapData.data.lightRotationEventBoxGroups, environment);
    const ebgTranslationCount = countEbg(mapData.data.lightTranslationEventBoxGroups, environment);

    for (const ebg in ebgColorCount) {
        if (!ebgRotationCount[ebg]) {
            ebgRotationCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
        if (!ebgTranslationCount[ebg]) {
            ebgTranslationCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
    }
    for (const ebg in ebgRotationCount) {
        if (!ebgColorCount[ebg]) {
            ebgColorCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
        if (!ebgTranslationCount[ebg]) {
            ebgTranslationCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
    }
    for (const ebg in ebgTranslationCount) {
        if (!ebgRotationCount[ebg]) {
            ebgRotationCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
        if (!ebgColorCount[ebg]) {
            ebgColorCount[ebg] = {
                total: 0,
                eventBox: 0,
                base: 0,
            };
        }
    }

    let htmlString = `<caption class="${prefix}table-caption">Event Box Group:</caption><tr><th class="${prefix}table-header"></th><th class="${prefix}table-header">Group</th><th class="${prefix}table-header">Box</th><th class="${prefix}table-header">Base</th><tr><th class="${prefix}table-header">Color</th><td class="${prefix}table-element">${Object.values(
        ebgColorCount,
    ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgColorCount,
    ).reduce((t, { eventBox }) => t + eventBox, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgColorCount,
    ).reduce(
        (t, { base }) => t + base,
        0,
    )}</td></tr><tr><th class="${prefix}table-header">Rotate</th><td class="${prefix}table-element">${Object.values(
        ebgRotationCount,
    ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgRotationCount,
    ).reduce((t, { eventBox }) => t + eventBox, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgRotationCount,
    ).reduce(
        (t, { base }) => t + base,
        0,
    )}</td></tr><tr><th class="${prefix}table-header">Translate</th><td class="${prefix}table-element">${Object.values(
        ebgTranslationCount,
    ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgTranslationCount,
    ).reduce((t, { eventBox }) => t + eventBox, 0)}</td><td class="${prefix}table-element">${Object.values(
        ebgTranslationCount,
    ).reduce(
        (t, { base }) => t + base,
        0,
    )}</td></tr><tr><th class="${prefix}table-header">Total</th><td class="${prefix}table-element">${
        Object.values(ebgColorCount).reduce((t, { total }) => t + total, 0) +
        Object.values(ebgRotationCount).reduce((t, { total }) => t + total, 0) +
        Object.values(ebgTranslationCount).reduce((t, { total }) => t + total, 0)
    }</td><td class="${prefix}table-element">${
        Object.values(ebgColorCount).reduce((t, { eventBox }) => t + eventBox, 0) +
        Object.values(ebgRotationCount).reduce((t, { eventBox }) => t + eventBox, 0) +
        Object.values(ebgTranslationCount).reduce((t, { eventBox }) => t + eventBox, 0)
    }</td><td class="${prefix}table-element">${
        Object.values(ebgColorCount).reduce((t, { base }) => t + base, 0) +
        Object.values(ebgRotationCount).reduce((t, { base }) => t + base, 0) +
        Object.values(ebgTranslationCount).reduce((t, { base }) => t + base, 0)
    }</td></tr>`;

    let htmlStringID = `<caption class="${prefix}table-caption">Event Box Group ID:</caption>`;

    for (const key in ebgColorCount) {
        htmlStringID += `<tr><th class="${prefix}table-header">${key}</th><th class="${prefix}table-header" colspan="5">${eventGroupRename(
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

    const htmlTableID = document.createElement('table');
    htmlTableID.className = prefix + 'table';
    htmlTableID.innerHTML = htmlStringID;

    const htmlContainer = document.createElement('div');
    htmlContainer.appendChild(htmlTable);
    htmlContainer.appendChild(document.createElement('br'));
    htmlContainer.appendChild(htmlTableID);

    return htmlContainer;
}
