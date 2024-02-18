import { IWrapInfo } from '../../types/beatmap/wrapper/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { countEbg } from '../../analyzers/stats/mod';
import { eventGroupRename } from '../../analyzers/renamer/mod';
import { prefix } from './constants';

function allPopulate(...d: Record<string, any>[]) {
   for (const r of d) {
      for (const k in r) {
         for (const n of d) {
            if (!n[k]) {
               n[k] = {
                  groups: 0,
                  boxes: 0,
                  bases: 0,
               };
            }
         }
      }
   }
}

export function createEBGCountTable(mapInfo: IWrapInfo, mapData: IBeatmapItem): HTMLDivElement {
   const environment = mapData.environment;
   const ebgColorCount = countEbg(mapData.lightshow.lightColorEventBoxGroups, environment);
   const ebgRotationCount = countEbg(mapData.lightshow.lightRotationEventBoxGroups, environment);
   const ebgTranslationCount = countEbg(
      mapData.lightshow.lightTranslationEventBoxGroups,
      environment,
   );
   const ebgFxCount = countEbg(mapData.lightshow.fxEventBoxGroups, environment);

   allPopulate(ebgColorCount, ebgRotationCount, ebgTranslationCount, ebgFxCount);

   let htmlString = `<caption class="${prefix}table-caption">Event Box Group:</caption><tr><th class="${prefix}table-header"></th><th class="${prefix}table-header">Group</th><th class="${prefix}table-header">Box</th><th class="${prefix}table-header">Base</th><tr><th class="${prefix}table-header">Color</th><td class="${prefix}table-element">${Object.values(
      ebgColorCount,
   ).reduce(
      (t, { groups }) => t + groups,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgColorCount).reduce(
      (t, { boxes }) => t + boxes,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgColorCount).reduce(
      (t, { bases }) => t + bases,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">Rotate</th><td class="${prefix}table-element">${Object.values(
      ebgRotationCount,
   ).reduce(
      (t, { groups }) => t + groups,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgRotationCount).reduce(
      (t, { boxes }) => t + boxes,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgRotationCount).reduce(
      (t, { bases }) => t + bases,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">Translate</th><td class="${prefix}table-element">${Object.values(
      ebgTranslationCount,
   ).reduce(
      (t, { groups }) => t + groups,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgTranslationCount).reduce(
      (t, { boxes }) => t + boxes,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgTranslationCount).reduce(
      (t, { bases }) => t + bases,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">FX</th><td class="${prefix}table-element">${Object.values(
      ebgFxCount,
   ).reduce(
      (t, { groups }) => t + groups,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgFxCount).reduce(
      (t, { boxes }) => t + boxes,
      0,
   )}</td><td class="${prefix}table-element">${Object.values(ebgFxCount).reduce(
      (t, { bases }) => t + bases,
      0,
   )}</td></tr><tr><th class="${prefix}table-header">Total</th><td class="${prefix}table-element">${
      Object.values(ebgColorCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgRotationCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgTranslationCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgFxCount).reduce((t, { groups }) => t + groups, 0)
   }</td><td class="${prefix}table-element">${
      Object.values(ebgColorCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgRotationCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgTranslationCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgFxCount).reduce((t, { boxes }) => t + boxes, 0)
   }</td><td class="${prefix}table-element">${
      Object.values(ebgColorCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgRotationCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgTranslationCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgFxCount).reduce((t, { bases }) => t + bases, 0)
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
      } Base)">${
         ebgTranslationCount[key].groups
      }</td><td class="${prefix}table-element" title="${ebgFxCount[key].groups} Box (${
         ebgFxCount[key].bases
      } Base)">${ebgFxCount[key].groups}</td></tr>`;
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
