import * as types from 'bsmap/types';
import { IBeatmapContainer } from '../../types';

export class UIStatsObstacle {
   static #htmlObstacleTotal: HTMLTableElement;
   static #htmlObstacleInteractive: HTMLTableElement;
   static #htmlObstacleChroma: HTMLTableElement;
   static #htmlObstacleNoodleExtensions: HTMLTableElement;
   static #htmlObstacleMappingExtensions: HTMLTableElement;

   static init(): void {
      UIStatsObstacle.#htmlObstacleTotal = document.querySelector('#stats__table-obstacles-total')!;
      UIStatsObstacle.#htmlObstacleInteractive = document.querySelector(
         '#stats__table-obstacles-interactive',
      )!;
      UIStatsObstacle.#htmlObstacleChroma = document.querySelector(
         '#stats__table-obstacles-chroma',
      )!;
      UIStatsObstacle.#htmlObstacleNoodleExtensions = document.querySelector(
         '#stats__table-obstacles-noodle',
      )!;
      UIStatsObstacle.#htmlObstacleMappingExtensions = document.querySelector(
         '#stats__table-obstacles-me',
      )!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const obstacleCount = beatmap.stats.obstacles;

      UIStatsObstacle.#htmlObstacleTotal.textContent = obstacleCount.total.toString();
      UIStatsObstacle.#htmlObstacleInteractive.textContent = obstacleCount.interactive.toString();
      if (obstacleCount.chroma) {
         UIStatsObstacle.#htmlObstacleChroma.textContent = obstacleCount.chroma.toString();
         (UIStatsObstacle.#htmlObstacleChroma.parentNode as HTMLElement).classList.remove('hidden');
      } else {
         (UIStatsObstacle.#htmlObstacleChroma.parentNode as HTMLElement).classList.add('hidden');
      }
      if (obstacleCount.noodleExtensions) {
         UIStatsObstacle.#htmlObstacleNoodleExtensions.textContent =
            obstacleCount.noodleExtensions.toString();
         (UIStatsObstacle.#htmlObstacleNoodleExtensions.parentNode as HTMLElement).classList.remove(
            'hidden',
         );
      } else {
         (UIStatsObstacle.#htmlObstacleNoodleExtensions.parentNode as HTMLElement).classList.add(
            'hidden',
         );
      }
      if (obstacleCount.mappingExtensions) {
         UIStatsObstacle.#htmlObstacleMappingExtensions.textContent =
            obstacleCount.mappingExtensions.toString();
         (
            UIStatsObstacle.#htmlObstacleMappingExtensions.parentNode as HTMLElement
         ).classList.remove('hidden');
      } else {
         (UIStatsObstacle.#htmlObstacleMappingExtensions.parentNode as HTMLElement).classList.add(
            'hidden',
         );
      }
   }
}
