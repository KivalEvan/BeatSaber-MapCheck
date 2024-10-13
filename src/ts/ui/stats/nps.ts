import { calculateNps, calculateNpsPeak, getLastInteractiveTime } from 'bsmap';
import * as types from 'bsmap/types';
import { round } from 'bsmap/utils';
import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';

const htmlNpsOverall = document.getElementById('stats__table-nps-overall') as HTMLTableElement;
const htmlNpsMapped = document.getElementById('stats__table-nps-mapped') as HTMLTableElement;
const htmlNpsPeak16 = document.getElementById('stats__table-nps-peak-16') as HTMLTableElement;
const htmlNpsPeak8 = document.getElementById('stats__table-nps-peak-8') as HTMLTableElement;
const htmlNpsPeak4 = document.getElementById('stats__table-nps-peak-4') as HTMLTableElement;

export function updateNPSTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
   const timeProcessor = beatmapItem.timeProcessor;
   const duration = LoadedData.duration || 0;
   const mapDuration = timeProcessor.toRealTime(getLastInteractiveTime(beatmapItem.data));

   htmlNpsOverall.textContent = round(calculateNps(beatmapItem.data, duration), 2).toString();
   htmlNpsMapped.textContent = round(calculateNps(beatmapItem.data, mapDuration), 2).toString();
   htmlNpsPeak16.textContent = round(
      calculateNpsPeak(beatmapItem.data, 16, timeProcessor),
      2,
   ).toString();
   htmlNpsPeak8.textContent = round(
      calculateNpsPeak(beatmapItem.data, 8, timeProcessor),
      2,
   ).toString();
   htmlNpsPeak4.textContent = round(
      calculateNpsPeak(beatmapItem.data, 4, timeProcessor),
      2,
   ).toString();
}
