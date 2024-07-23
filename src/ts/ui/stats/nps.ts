import { calculateNps, calculateNpsPeak, getLastInteractiveTime, round, types } from 'bsmap';
import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';

export function createNPSTable(
   beatmapInfo: types.wrapper.IWrapInfo,
   beatmap: IBeatmapItem,
): HTMLTableElement {
   const timeProcessor = beatmap.timeProcessor;
   const duration = LoadedData.duration || 0;
   const mapDuration = timeProcessor.toRealTime(getLastInteractiveTime(beatmap.data));

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = `<caption class="${prefix}table-caption">Note Per Seconds (NPS):</caption><tr><th class="${prefix}table-header" colspan="2">Overall</th><td class="${prefix}table-element">${round(
      calculateNps(beatmap.data, duration),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Mapped</th><td class="${prefix}table-element">${round(
      calculateNps(beatmap.data, mapDuration),
      2,
   )}</td></tr><tr><th class="${prefix}table-header" rowspan="3">Peak</th><th class="${prefix}table-header">16-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmap.data, 16, timeProcessor),
      2,
   )}</td></tr><tr><th class="${prefix}table-header">8-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmap.data, 8, timeProcessor),
      2,
   )}</td></tr><tr><th class="${prefix}table-header">4-beat</th><td class="${prefix}table-element">${round(
      calculateNpsPeak(beatmap.data, 4, timeProcessor),
      2,
   )}</td></tr>`;

   return htmlTable;
}
