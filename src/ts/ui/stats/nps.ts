import { calculateNps, calculateNpsPeak, getLastInteractiveTime } from 'bsmap';
import * as types from 'bsmap/types';
import { round } from 'bsmap/utils';
import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';

export function createNPSTable(
   info: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): HTMLTableElement {
   const timeProcessor = beatmapItem.timeProcessor;
   const duration = LoadedData.duration || 0;
   const mapDuration = timeProcessor.toRealTime(getLastInteractiveTime(beatmapItem.data));

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = `<caption class="${prefix}table-caption">Note Per Seconds (NPS):</caption><tr><th class="${prefix}table-header" colspan="2">Overall</th><td class="${prefix}table-element">${round(
      calculateNps(beatmapItem.data, duration),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Mapped</th><td class="${prefix}table-element">${round(
      calculateNps(beatmapItem.data, mapDuration),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" rowspan="3">Peak</th><th class="${prefix}table-header">16-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmapItem.data, 16, timeProcessor),
      2,
   )}</td></tr><tr><th class="${prefix}table-header">8-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmapItem.data, 8, timeProcessor),
      2,
   )}</td></tr><tr><th class="${prefix}table-header">4-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmapItem.data, 4, timeProcessor),
      2,
   )}</td></tr>`;

   return htmlTable;
}
