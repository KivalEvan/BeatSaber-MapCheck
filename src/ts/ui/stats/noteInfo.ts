import { round, formatNumber } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';
import { swing } from 'bsmap/extensions';

export function createNoteInfoTable(
   info: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): HTMLTableElement {
   const noteCount = beatmapItem.stats.notes;
   let htmlString = `<caption class="${prefix}table-caption">Note Information:</caption><tr><th class="${prefix}table-header" colspan="2">R/B Ratio</th><td class="${prefix}table-element">${round(
      noteCount.red.total / noteCount.blue.total,
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Max Score</th><td class="${prefix}table-element">${formatNumber(
      beatmapItem.score,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM</th><td class="${prefix}table-element">${round(
      swing.getMaxEffectiveBpm(beatmapItem.swingAnalysis.container),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM (swing)</th><td class="${prefix}table-element">${round(
      swing.getMaxEffectiveBpmSwing(beatmapItem.swingAnalysis.container),
      2,
   )}</td></tr>`;

   let minSpeed = round(swing.getMinSliderSpeed(beatmapItem.swingAnalysis.container) * 1000, 1);
   let maxSpeed = round(swing.getMaxSliderSpeed(beatmapItem.swingAnalysis.container) * 1000, 1);
   if (minSpeed && maxSpeed) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Min. Slider Speed</th><td class="${prefix}table-element">${minSpeed}ms</td></tr><tr><th class="${prefix}table-header" colspan="2">Max. Slider Speed</th><td class="${prefix}table-element">${maxSpeed}ms</td></tr>`;
   }

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;

   return htmlTable;
}
