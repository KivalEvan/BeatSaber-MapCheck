import { formatNumber, round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapContainer } from '../../types';
import { swing } from 'bsmap/extensions';

export class UIStatsNoteInfo {
   static #htmlNiRatio: HTMLTableCellElement;
   static #htmlNiMaxScore: HTMLTableCellElement;
   static #htmlNiEffectiveBpm: HTMLTableCellElement;
   static #htmlNiEffectiveBpmSwing: HTMLTableCellElement;
   static #htmlNiMinSliderSpeed: HTMLTableCellElement;
   static #htmlNiMaxSliderSpeed: HTMLTableCellElement;

   static init(): void {
      UIStatsNoteInfo.#htmlNiRatio = document.querySelector('#stats__table-ni-ratio')!;
      UIStatsNoteInfo.#htmlNiMaxScore = document.querySelector('#stats__table-ni-maxscore')!;
      UIStatsNoteInfo.#htmlNiEffectiveBpm = document.querySelector('#stats__table-ni-ebpm')!;
      UIStatsNoteInfo.#htmlNiEffectiveBpmSwing = document.querySelector(
         '#stats__table-ni-ebpm-swing',
      )!;
      UIStatsNoteInfo.#htmlNiMinSliderSpeed = document.querySelector('#stats__table-ni-minspeed')!;
      UIStatsNoteInfo.#htmlNiMaxSliderSpeed = document.querySelector('#stats__table-ni-maxspeed')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const noteCount = beatmap.stats.notes;

      UIStatsNoteInfo.#htmlNiRatio.textContent = round(
         noteCount.red.total / noteCount.blue.total,
         2,
      ).toString();
      UIStatsNoteInfo.#htmlNiMaxScore.textContent = formatNumber(beatmap.score);
      UIStatsNoteInfo.#htmlNiEffectiveBpm.textContent = round(
         swing.getMaxEffectiveBpm(beatmap.swingAnalysis.container),
         2,
      ).toString();
      UIStatsNoteInfo.#htmlNiEffectiveBpmSwing.textContent = round(
         swing.getMaxEffectiveBpmSwing(beatmap.swingAnalysis.container),
         2,
      ).toString();

      const minSliderSpeed = round(
         swing.getMinSliderSpeed(beatmap.swingAnalysis.container) * 1000,
         1,
      );
      const maxSliderSpeed = round(
         swing.getMaxSliderSpeed(beatmap.swingAnalysis.container) * 1000,
         1,
      );
      if (minSliderSpeed || maxSliderSpeed) {
         UIStatsNoteInfo.#htmlNiMinSliderSpeed.textContent = minSliderSpeed.toString() + 'ms';
         UIStatsNoteInfo.#htmlNiMaxSliderSpeed.textContent = minSliderSpeed.toString() + 'ms';
         (UIStatsNoteInfo.#htmlNiMinSliderSpeed.parentNode as HTMLElement).classList.remove(
            'hidden',
         );
         (UIStatsNoteInfo.#htmlNiMaxSliderSpeed.parentNode as HTMLElement).classList.remove(
            'hidden',
         );
      } else {
         (UIStatsNoteInfo.#htmlNiMinSliderSpeed.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNoteInfo.#htmlNiMaxSliderSpeed.parentNode as HTMLElement).classList.add('hidden');
      }
   }
}
