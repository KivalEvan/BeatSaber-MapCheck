import { types } from 'bsmap';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';
import { stats } from 'bsmap/extensions';

export function createObstacleCountTable(
   mapInfo: types.wrapper.IWrapInfo,
   mapData: IBeatmapItem,
): HTMLTableElement {
   const obstacleCount = stats.countObstacle(mapData.data.obstacles);

   let htmlString = `<caption class="${prefix}table-caption">Obstacles: ${obstacleCount.total}</caption>`;
   if (obstacleCount.interactive) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Interactive</th><td class="${prefix}table-element">${obstacleCount.interactive}</td></tr>`;
   }
   if (obstacleCount.chroma) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Chroma</th><td class="${prefix}table-element">${obstacleCount.chroma}</td></tr>`;
   }
   if (obstacleCount.noodleExtensions) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Noodle Extensions</th><td class="${prefix}table-element">${obstacleCount.noodleExtensions}</td></tr>`;
   }
   if (obstacleCount.mappingExtensions) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Mapping Extensions</th><td class="${prefix}table-element">${obstacleCount.mappingExtensions}</td></tr>`;
   }

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;

   return htmlTable;
}
