import { round } from '../../bsmap/utils/mod';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';

export function createSPSTable(mapInfo: IWrapInfo, mapData: IBeatmapItem): HTMLTableElement {
   const swingInfo = mapData.swingAnalysis;

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = `<caption class="${prefix}table-caption">Swing Per Seconds (SPS):</caption><tr><th class="${prefix}table-header"></th><th class="${prefix}table-header">Total</th><th class="${prefix}table-header">Red</th><th class="${prefix}table-header">Blue</th></tr><tr><th class="${prefix}table-header">Average</th><td class="${prefix}table-element">${round(
      swingInfo.total.average,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.red.average,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.blue.average,
      2,
   )}</td></tr><tr><th class="${prefix}table-header">Median</th><td class="${prefix}table-element">${round(
      swingInfo.total.median,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.red.median,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.blue.median,
      2,
   )}</td></tr><tr><th class="${prefix}table-header">Peak</th><td class="${prefix}table-element">${round(
      swingInfo.total.peak,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.red.peak,
      2,
   )}</td><td class="${prefix}table-element">${round(
      swingInfo.blue.peak,
      2,
   )}</td></tr><tr><th class="${prefix}table-header">Total</th><td class="${prefix}table-element">${swingInfo.total.total}</td><td class="${prefix}table-element">${swingInfo.red.total}</td><td class="${prefix}table-element">${swingInfo.blue.total}</td></tr>`;

   return htmlTable;
}
