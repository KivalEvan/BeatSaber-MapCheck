import { types, calculateScore, round, formatNumber } from 'bsmap';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';
import { stats, swing } from 'bsmap/extensions';

export function createNoteInfoTable(
   beatmapInfo: types.wrapper.IWrapInfo,
   beatmap: IBeatmapItem,
): HTMLTableElement {
   const noteCount = stats.countNote(beatmap.data.colorNotes);
   let htmlString = `<caption class="${prefix}table-caption">Note Information:</caption><tr><th class="${prefix}table-header" colspan="2">R/B Ratio</th><td class="${prefix}table-element">${round(
      noteCount.red.total / noteCount.blue.total,
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Max Score</th><td class="${prefix}table-element">${formatNumber(
      calculateScore(beatmap.data),
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM</th><td class="${prefix}table-element">${round(
      swing.getMaxEffectiveBpm(beatmap.swingAnalysis.container),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Effective BPM (swing)</th><td class="${prefix}table-element">${round(
      swing.getMaxEffectiveBpmSwing(beatmap.swingAnalysis.container),
      2,
   )}</td></tr>`;

   let minSpeed = round(swing.getMinSliderSpeed(beatmap.swingAnalysis.container) * 1000, 1);
   let maxSpeed = round(swing.getMaxSliderSpeed(beatmap.swingAnalysis.container) * 1000, 1);
   if (minSpeed && maxSpeed) {
      htmlString += `<tr><th class="${prefix}table-header" colspan="2">Min. Slider Speed</th><td class="${prefix}table-element">${minSpeed}ms</td></tr><tr><th class="${prefix}table-header" colspan="2">Max. Slider Speed</th><td class="${prefix}table-element">${maxSpeed}ms</td></tr>`;
   }

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;

   return htmlTable;
}
