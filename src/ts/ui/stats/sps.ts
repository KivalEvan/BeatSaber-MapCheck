import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapContainer } from '../../types';

export class UIStatsSPS {
   static #htmlSpsAvgTotal: HTMLTableElement;
   static #htmlSpsAvgRed: HTMLTableElement;
   static #htmlSpsAvgBlue: HTMLTableElement;
   static #htmlSpsMedianTotal: HTMLTableElement;
   static #htmlSpsMedianRed: HTMLTableElement;
   static #htmlSpsMedianBlue: HTMLTableElement;
   static #htmlSpsPeakTotal: HTMLTableElement;
   static #htmlSpsPeakRed: HTMLTableElement;
   static #htmlSpsPeakBlue: HTMLTableElement;
   static #htmlSpsTotalTotal: HTMLTableElement;
   static #htmlSpsTotalRed: HTMLTableElement;
   static #htmlSpsTotalBlue: HTMLTableElement;

   static init(): void {
      UIStatsSPS.#htmlSpsAvgTotal = document.querySelector('#stats__table-sps-avg-total')!;
      UIStatsSPS.#htmlSpsAvgRed = document.querySelector('#stats__table-sps-avg-red')!;
      UIStatsSPS.#htmlSpsAvgBlue = document.querySelector('#stats__table-sps-avg-blue')!;
      UIStatsSPS.#htmlSpsMedianTotal = document.querySelector('#stats__table-sps-median-total')!;
      UIStatsSPS.#htmlSpsMedianRed = document.querySelector('#stats__table-sps-median-red')!;
      UIStatsSPS.#htmlSpsMedianBlue = document.querySelector('#stats__table-sps-median-blue')!;
      UIStatsSPS.#htmlSpsPeakTotal = document.querySelector('#stats__table-sps-peak-total')!;
      UIStatsSPS.#htmlSpsPeakRed = document.querySelector('#stats__table-sps-peak-red')!;
      UIStatsSPS.#htmlSpsPeakBlue = document.querySelector('#stats__table-sps-peak-blue')!;
      UIStatsSPS.#htmlSpsTotalTotal = document.querySelector('#stats__table-sps-total-total')!;
      UIStatsSPS.#htmlSpsTotalRed = document.querySelector('#stats__table-sps-total-red')!;
      UIStatsSPS.#htmlSpsTotalBlue = document.querySelector('#stats__table-sps-total-blue')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const swingInfo = beatmap.swingAnalysis;

      UIStatsSPS.#htmlSpsAvgTotal.innerText = round(swingInfo.total.perSecond, 2).toString();
      UIStatsSPS.#htmlSpsAvgRed.innerText = round(swingInfo.red.perSecond, 2).toString();
      UIStatsSPS.#htmlSpsAvgBlue.innerText = round(swingInfo.blue.perSecond, 2).toString();
      UIStatsSPS.#htmlSpsMedianTotal.innerText = round(swingInfo.total.median, 2).toString();
      UIStatsSPS.#htmlSpsMedianRed.innerText = round(swingInfo.red.median, 2).toString();
      UIStatsSPS.#htmlSpsMedianBlue.innerText = round(swingInfo.blue.median, 2).toString();
      UIStatsSPS.#htmlSpsPeakTotal.innerText = round(swingInfo.total.peak, 2).toString();
      UIStatsSPS.#htmlSpsPeakRed.innerText = round(swingInfo.red.peak, 2).toString();
      UIStatsSPS.#htmlSpsPeakBlue.innerText = round(swingInfo.blue.peak, 2).toString();
      UIStatsSPS.#htmlSpsTotalTotal.innerText = round(swingInfo.total.total, 2).toString();
      UIStatsSPS.#htmlSpsTotalRed.innerText = round(swingInfo.red.total, 2).toString();
      UIStatsSPS.#htmlSpsTotalBlue.innerText = round(swingInfo.blue.total, 2).toString();
   }
}
