import { IWrapInfo } from '../../types/beatmap/wrapper/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { countEbg } from '../../analyzers/stats/mod';
import { eventGroupRename } from '../../analyzers/renamer/mod';
import { prefix } from './constants';

export function createEBGCountTable(mapInfo: IWrapInfo, mapData: IBeatmapItem): HTMLDivElement {
   const environment =
      mapData.characteristic === '360Degree' || mapData.characteristic === '90Degree'
         ? mapInfo.allDirectionsEnvironmentName
         : mapInfo.environmentName;
   const ebgColorCount = countEbg(mapData.data.lightColorEventBoxGroups, environment);
   const ebgRotationCount = countEbg(mapData.data.lightRotationEventBoxGroups, environment);
   const ebgTranslationCount = countEbg(mapData.data.lightTranslationEventBoxGroups, environment);

   for (const ebg in ebgColorCount) {
      if (!ebgRotationCount[ebg]) {
         ebgRotationCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
      if (!ebgTranslationCount[ebg]) {
         ebgTranslationCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
   }
   for (const ebg in ebgRotationCount) {
      if (!ebgColorCount[ebg]) {
         ebgColorCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
      if (!ebgTranslationCount[ebg]) {
         ebgTranslationCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
   }
   for (const ebg in ebgTranslationCount) {
      if (!ebgRotationCount[ebg]) {
         ebgRotationCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
      if (!ebgColorCount[ebg]) {
         ebgColorCount[ebg] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
   }

   let htmlString = `<caption class="${prefix}table-caption">Event Box Group:</caption><tr><th class="${prefix}table-header"></th><th class="${prefix}table-header">Group</th><th class="${prefix}table-header">Box</th><th class="${prefix}table-header">Base</th><tr><th class="${prefix}table-header">Color</th><td class="${prefix}table-element">${Object.values(
      ebgColorCount,
   ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
      ebgColorCount,
   ).reduce(
      (t, { eventBox }) => t + eventBox,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgColorCount).reduce(
      (t, { base }) => t + base,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">Rotate</th><td class="${prefix}table-element">${Object.values(
      ebgRotationCount,
   ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
      ebgRotationCount,
   ).reduce(
      (t, { eventBox }) => t + eventBox,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgRotationCount).reduce(
      (t, { base }) => t + base,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">Translate</th><td class="${prefix}table-element">${Object.values(
      ebgTranslationCount,
   ).reduce((t, { total }) => t + total, 0)}</td><td class="${prefix}table-element">${Object.values(
      ebgTranslationCount,
   ).reduce(
      (t, { eventBox }) => t + eventBox,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgTranslationCount).reduce(
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
      )}</th><td class="${prefix}table-element" title="${ebgColorCount[key].groups} Box (${
         ebgColorCount[key].bases
      } Base)">${ebgColorCount[key].groups}</td><td class="${prefix}table-element" title="${
         ebgRotationCount[key].boxes
      } Box (${ebgRotationCount[key].bases} Base)">${
         ebgRotationCount[key].groups
      }</td><td class="${prefix}table-element" title="${ebgTranslationCount[key].boxes} Box (${
         ebgTranslationCount[key].bases
      } Base)">${ebgTranslationCount[key].groups}</td></tr>`;
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
