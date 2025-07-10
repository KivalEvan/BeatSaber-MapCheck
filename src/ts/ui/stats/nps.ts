import { calculateNps, calculateNpsPeak, getLastInteractiveTime } from 'bsmap';
import * as types from 'bsmap/types';
import { round } from 'bsmap/utils';
import { State } from '../../state';
import { IBeatmapContainer } from '../../types';

export class UIStatsNPS {
   static #htmlNpsOverall: HTMLTableElement;
   static #htmlNpsMapped: HTMLTableElement;
   static #htmlNpsPeak16: HTMLTableElement;
   static #htmlNpsPeak8: HTMLTableElement;
   static #htmlNpsPeak4: HTMLTableElement;

   static init(): void {
      UIStatsNPS.#htmlNpsOverall = document.querySelector('#stats__table-nps-overall')!;
      UIStatsNPS.#htmlNpsMapped = document.querySelector('#stats__table-nps-mapped')!;
      UIStatsNPS.#htmlNpsPeak16 = document.querySelector('#stats__table-nps-peak-16')!;
      UIStatsNPS.#htmlNpsPeak8 = document.querySelector('#stats__table-nps-peak-8')!;
      UIStatsNPS.#htmlNpsPeak4 = document.querySelector('#stats__table-nps-peak-4')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const timeProcessor = beatmap.timeProcessor;
      const duration = State.data.duration || 0;
      const mapDuration = timeProcessor.toRealTime(getLastInteractiveTime(beatmap.data));

      UIStatsNPS.#htmlNpsOverall.textContent = round(
         calculateNps(beatmap.data, duration),
         2,
      ).toString();
      UIStatsNPS.#htmlNpsMapped.textContent = round(
         calculateNps(beatmap.data, mapDuration),
         2,
      ).toString();
      UIStatsNPS.#htmlNpsPeak16.textContent = round(
         calculateNpsPeak(beatmap.data, 16, timeProcessor),
         2,
      ).toString();
      UIStatsNPS.#htmlNpsPeak8.textContent = round(
         calculateNpsPeak(beatmap.data, 8, timeProcessor),
         2,
      ).toString();
      UIStatsNPS.#htmlNpsPeak4.textContent = round(
         calculateNpsPeak(beatmap.data, 4, timeProcessor),
         2,
      ).toString();
   }
}
