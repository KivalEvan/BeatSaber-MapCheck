import { IBeatmapItem } from '../../types';
import { prefix } from './constants';
import * as types from 'bsmap/types';
import { renamer } from 'bsmap/extensions';

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

const htmlEbgId = document.getElementById('stats__table-ebg-content') as HTMLTableElement;
const htmlEbgGroupTotal = document.getElementById(
   'stats__table-ebg-group-total',
) as HTMLTableElement;
const htmlEbgBoxTotal = document.getElementById('stats__table-ebg-box-total') as HTMLTableElement;
const htmlEbgBaseTotal = document.getElementById('stats__table-ebg-base-total') as HTMLTableElement;
const htmlEbgGroupColor = document.getElementById(
   'stats__table-ebg-group-color',
) as HTMLTableElement;
const htmlEbgBoxColor = document.getElementById('stats__table-ebg-box-color') as HTMLTableElement;
const htmlEbgBaseColor = document.getElementById('stats__table-ebg-base-color') as HTMLTableElement;
const htmlEbgGroupRotate = document.getElementById(
   'stats__table-ebg-group-rotate',
) as HTMLTableElement;
const htmlEbgBoxRotate = document.getElementById('stats__table-ebg-box-rotate') as HTMLTableElement;
const htmlEbgBaseRotate = document.getElementById(
   'stats__table-ebg-base-rotate',
) as HTMLTableElement;
const htmlEbgGroupTranslate = document.getElementById(
   'stats__table-ebg-group-translate',
) as HTMLTableElement;
const htmlEbgBoxTranslate = document.getElementById(
   'stats__table-ebg-box-translate',
) as HTMLTableElement;
const htmlEbgBaseTranslate = document.getElementById(
   'stats__table-ebg-base-translate',
) as HTMLTableElement;
const htmlEbgGroupFx = document.getElementById('stats__table-ebg-group-fx') as HTMLTableElement;
const htmlEbgBoxFx = document.getElementById('stats__table-ebg-box-fx') as HTMLTableElement;
const htmlEbgBaseFx = document.getElementById('stats__table-ebg-base-fx') as HTMLTableElement;

export function updateEBGCountTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
   const environment = beatmapItem.environment;
   const ebgColorCount = beatmapItem.stats.lightColorEventBoxGroups;
   const ebgRotationCount = beatmapItem.stats.lightRotationEventBoxGroups;
   const ebgTranslationCount = beatmapItem.stats.lightTranslationEventBoxGroups;
   const ebgFxCount = beatmapItem.stats.fxEventBoxGroups;

   allPopulate(ebgColorCount, ebgRotationCount, ebgTranslationCount, ebgFxCount);

   htmlEbgGroupTotal.textContent = (
      Object.values(ebgColorCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgRotationCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgTranslationCount).reduce((t, { groups }) => t + groups, 0) +
      Object.values(ebgFxCount).reduce((t, { groups }) => t + groups, 0)
   ).toString();
   htmlEbgBoxTotal.textContent = (
      Object.values(ebgColorCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgRotationCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgTranslationCount).reduce((t, { boxes }) => t + boxes, 0) +
      Object.values(ebgFxCount).reduce((t, { boxes }) => t + boxes, 0)
   ).toString();
   htmlEbgBaseTotal.textContent = (
      Object.values(ebgColorCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgRotationCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgTranslationCount).reduce((t, { bases }) => t + bases, 0) +
      Object.values(ebgFxCount).reduce((t, { bases }) => t + bases, 0)
   ).toString();

   htmlEbgGroupColor.textContent = Object.values(ebgColorCount)
      .reduce((t, { groups }) => t + groups, 0)
      .toString();
   htmlEbgBoxColor.textContent = Object.values(ebgColorCount)
      .reduce((t, { boxes }) => t + boxes, 0)
      .toString();
   htmlEbgBaseColor.textContent = Object.values(ebgColorCount)
      .reduce((t, { bases }) => t + bases, 0)
      .toString();

   htmlEbgGroupRotate.textContent = Object.values(ebgRotationCount)
      .reduce((t, { groups }) => t + groups, 0)
      .toString();
   htmlEbgBoxRotate.textContent = Object.values(ebgRotationCount)
      .reduce((t, { boxes }) => t + boxes, 0)
      .toString();
   htmlEbgBaseRotate.textContent = Object.values(ebgRotationCount)
      .reduce((t, { bases }) => t + bases, 0)
      .toString();

   htmlEbgGroupTranslate.textContent = Object.values(ebgTranslationCount)
      .reduce((t, { groups }) => t + groups, 0)
      .toString();
   htmlEbgBoxTranslate.textContent = Object.values(ebgTranslationCount)
      .reduce((t, { boxes }) => t + boxes, 0)
      .toString();
   htmlEbgBaseTranslate.textContent = Object.values(ebgTranslationCount)
      .reduce((t, { bases }) => t + bases, 0)
      .toString();

   htmlEbgGroupFx.textContent = Object.values(ebgFxCount)
      .reduce((t, { groups }) => t + groups, 0)
      .toString();
   htmlEbgBoxFx.textContent = Object.values(ebgFxCount)
      .reduce((t, { boxes }) => t + boxes, 0)
      .toString();
   htmlEbgBaseFx.textContent = Object.values(ebgFxCount)
      .reduce((t, { bases }) => t + bases, 0)
      .toString();

   let htmlStringID = ``;
   for (const key in ebgColorCount) {
      htmlStringID += `<tr><th class="${prefix}table-header">${key}</th><th class="${prefix}table-header" colspan="5">${renamer.eventGroupRename(
         parseInt(key),
         environment,
      )}</th><td class="${prefix}table-element" title="${
         ebgColorCount[key].groups
      } Box (${ebgColorCount[key].bases} Base)">${
         ebgColorCount[key].groups
      }</td><td class="${prefix}table-element" title="${
         ebgRotationCount[key].boxes
      } Box (${ebgRotationCount[key].bases} Base)">${
         ebgRotationCount[key].groups
      }</td><td class="${prefix}table-element" title="${
         ebgTranslationCount[key].boxes
      } Box (${ebgTranslationCount[key].bases} Base)">${
         ebgTranslationCount[key].groups
      }</td><td class="${prefix}table-element" title="${
         ebgFxCount[key].groups
      } Box (${ebgFxCount[key].bases} Base)">${ebgFxCount[key].groups}</td></tr>`;
   }
   htmlEbgId.innerHTML = htmlStringID;
}
