import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';

const htmlObstacleTotal = document.getElementById(
   'stats__table-obstacles-total',
) as HTMLTableElement;
const htmlObstacleInteractive = document.getElementById(
   'stats__table-obstacles-interactive',
) as HTMLTableElement;
const htmlObstacleChroma = document.getElementById(
   'stats__table-obstacles-chroma',
) as HTMLTableElement;
const htmlObstacleNoodleExtensions = document.getElementById(
   'stats__table-obstacles-noodle',
) as HTMLTableElement;
const htmlObstacleMappingExtensions = document.getElementById(
   'stats__table-obstacles-me',
) as HTMLTableElement;

export function updateObstacleCountTable(
   _: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): void {
   const obstacleCount = beatmapItem.stats.obstacles;

   htmlObstacleTotal.textContent = obstacleCount.total.toString();
   htmlObstacleInteractive.textContent = obstacleCount.interactive.toString();
   if (obstacleCount.chroma) {
      htmlObstacleChroma.textContent = obstacleCount.chroma.toString();
      (htmlObstacleChroma.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlObstacleChroma.parentNode as HTMLElement).classList.add('hidden');
   }
   if (obstacleCount.noodleExtensions) {
      htmlObstacleNoodleExtensions.textContent = obstacleCount.noodleExtensions.toString();
      (htmlObstacleNoodleExtensions.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlObstacleNoodleExtensions.parentNode as HTMLElement).classList.add('hidden');
   }
   if (obstacleCount.mappingExtensions) {
      htmlObstacleMappingExtensions.textContent = obstacleCount.mappingExtensions.toString();
      (htmlObstacleMappingExtensions.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlObstacleMappingExtensions.parentNode as HTMLElement).classList.add('hidden');
   }
}
