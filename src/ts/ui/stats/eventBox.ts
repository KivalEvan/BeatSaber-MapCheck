import { IBeatmapContainer } from '../../types';
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

export class UIStatsEventBox {
   static #htmlEbgId: HTMLTableElement;
   static #htmlEbgGroupTotal: HTMLTableElement;
   static #htmlEbgBoxTotal: HTMLTableElement;
   static #htmlEbgBaseTotal: HTMLTableElement;
   static #htmlEbgGroupColor: HTMLTableElement;
   static #htmlEbgBoxColor: HTMLTableElement;
   static #htmlEbgBaseColor: HTMLTableElement;
   static #htmlEbgGroupRotate: HTMLTableElement;
   static #htmlEbgBoxRotate: HTMLTableElement;
   static #htmlEbgBaseRotate: HTMLTableElement;
   static #htmlEbgGroupTranslate: HTMLTableElement;
   static #htmlEbgBoxTranslate: HTMLTableElement;
   static #htmlEbgBaseTranslate: HTMLTableElement;
   static #htmlEbgGroupFx: HTMLTableElement;
   static #htmlEbgBoxFx: HTMLTableElement;
   static #htmlEbgBaseFx: HTMLTableElement;

   static init(): void {
      UIStatsEventBox.#htmlEbgId = document.querySelector('#stats__table-ebg-content')!;
      UIStatsEventBox.#htmlEbgGroupTotal = document.querySelector('#stats__table-ebg-group-total')!;
      UIStatsEventBox.#htmlEbgBoxTotal = document.querySelector('#stats__table-ebg-box-total')!;
      UIStatsEventBox.#htmlEbgBaseTotal = document.querySelector('#stats__table-ebg-base-total')!;
      UIStatsEventBox.#htmlEbgGroupColor = document.querySelector('#stats__table-ebg-group-color')!;
      UIStatsEventBox.#htmlEbgBoxColor = document.querySelector('#stats__table-ebg-box-color')!;
      UIStatsEventBox.#htmlEbgBaseColor = document.querySelector('#stats__table-ebg-base-color')!;
      UIStatsEventBox.#htmlEbgGroupRotate = document.querySelector(
         '#stats__table-ebg-group-rotate',
      )!;
      UIStatsEventBox.#htmlEbgBoxRotate = document.querySelector('#stats__table-ebg-box-rotate')!;
      UIStatsEventBox.#htmlEbgBaseRotate = document.querySelector('#stats__table-ebg-base-rotate')!;
      UIStatsEventBox.#htmlEbgGroupTranslate = document.querySelector(
         '#stats__table-ebg-group-translate',
      )!;
      UIStatsEventBox.#htmlEbgBoxTranslate = document.querySelector(
         '#stats__table-ebg-box-translate',
      )!;
      UIStatsEventBox.#htmlEbgBaseTranslate = document.querySelector(
         '#stats__table-ebg-base-translate',
      )!;
      UIStatsEventBox.#htmlEbgGroupFx = document.querySelector('#stats__table-ebg-group-fx')!;
      UIStatsEventBox.#htmlEbgBoxFx = document.querySelector('#stats__table-ebg-box-fx')!;
      UIStatsEventBox.#htmlEbgBaseFx = document.querySelector('#stats__table-ebg-base-fx')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const environment = beatmap.environment;
      const ebgColorCount = beatmap.stats.lightColorEventBoxGroups;
      const ebgRotationCount = beatmap.stats.lightRotationEventBoxGroups;
      const ebgTranslationCount = beatmap.stats.lightTranslationEventBoxGroups;
      const ebgFxCount = beatmap.stats.fxEventBoxGroups;

      allPopulate(ebgColorCount, ebgRotationCount, ebgTranslationCount, ebgFxCount);

      UIStatsEventBox.#htmlEbgGroupTotal.textContent = (
         Object.values(ebgColorCount).reduce((t, { groups }) => t + groups, 0) +
         Object.values(ebgRotationCount).reduce((t, { groups }) => t + groups, 0) +
         Object.values(ebgTranslationCount).reduce((t, { groups }) => t + groups, 0) +
         Object.values(ebgFxCount).reduce((t, { groups }) => t + groups, 0)
      ).toString();
      UIStatsEventBox.#htmlEbgBoxTotal.textContent = (
         Object.values(ebgColorCount).reduce((t, { boxes }) => t + boxes, 0) +
         Object.values(ebgRotationCount).reduce((t, { boxes }) => t + boxes, 0) +
         Object.values(ebgTranslationCount).reduce((t, { boxes }) => t + boxes, 0) +
         Object.values(ebgFxCount).reduce((t, { boxes }) => t + boxes, 0)
      ).toString();
      UIStatsEventBox.#htmlEbgBaseTotal.textContent = (
         Object.values(ebgColorCount).reduce((t, { bases }) => t + bases, 0) +
         Object.values(ebgRotationCount).reduce((t, { bases }) => t + bases, 0) +
         Object.values(ebgTranslationCount).reduce((t, { bases }) => t + bases, 0) +
         Object.values(ebgFxCount).reduce((t, { bases }) => t + bases, 0)
      ).toString();

      UIStatsEventBox.#htmlEbgGroupColor.textContent = Object.values(ebgColorCount)
         .reduce((t, { groups }) => t + groups, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBoxColor.textContent = Object.values(ebgColorCount)
         .reduce((t, { boxes }) => t + boxes, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBaseColor.textContent = Object.values(ebgColorCount)
         .reduce((t, { bases }) => t + bases, 0)
         .toString();

      UIStatsEventBox.#htmlEbgGroupRotate.textContent = Object.values(ebgRotationCount)
         .reduce((t, { groups }) => t + groups, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBoxRotate.textContent = Object.values(ebgRotationCount)
         .reduce((t, { boxes }) => t + boxes, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBaseRotate.textContent = Object.values(ebgRotationCount)
         .reduce((t, { bases }) => t + bases, 0)
         .toString();

      UIStatsEventBox.#htmlEbgGroupTranslate.textContent = Object.values(ebgTranslationCount)
         .reduce((t, { groups }) => t + groups, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBoxTranslate.textContent = Object.values(ebgTranslationCount)
         .reduce((t, { boxes }) => t + boxes, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBaseTranslate.textContent = Object.values(ebgTranslationCount)
         .reduce((t, { bases }) => t + bases, 0)
         .toString();

      UIStatsEventBox.#htmlEbgGroupFx.textContent = Object.values(ebgFxCount)
         .reduce((t, { groups }) => t + groups, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBoxFx.textContent = Object.values(ebgFxCount)
         .reduce((t, { boxes }) => t + boxes, 0)
         .toString();
      UIStatsEventBox.#htmlEbgBaseFx.textContent = Object.values(ebgFxCount)
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
      UIStatsEventBox.#htmlEbgId.innerHTML = htmlStringID;
   }
}
