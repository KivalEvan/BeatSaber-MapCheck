import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';

const htmlSpsAvgTotal = document.getElementById('stats__table-sps-avg-total') as HTMLTableElement;
const htmlSpsAvgRed = document.getElementById('stats__table-sps-avg-red') as HTMLTableElement;
const htmlSpsAvgBlue = document.getElementById('stats__table-sps-avg-blue') as HTMLTableElement;
const htmlSpsMedianTotal = document.getElementById(
   'stats__table-sps-median-total',
) as HTMLTableElement;
const htmlSpsMedianRed = document.getElementById('stats__table-sps-median-red') as HTMLTableElement;
const htmlSpsMedianBlue = document.getElementById(
   'stats__table-sps-median-blue',
) as HTMLTableElement;
const htmlSpsPeakTotal = document.getElementById('stats__table-sps-peak-total') as HTMLTableElement;
const htmlSpsPeakRed = document.getElementById('stats__table-sps-peak-red') as HTMLTableElement;
const htmlSpsPeakBlue = document.getElementById('stats__table-sps-peak-blue') as HTMLTableElement;
const htmlSpsTotalTotal = document.getElementById(
   'stats__table-sps-total-total',
) as HTMLTableElement;
const htmlSpsTotalRed = document.getElementById('stats__table-sps-total-red') as HTMLTableElement;
const htmlSpsTotalBlue = document.getElementById('stats__table-sps-total-blue') as HTMLTableElement;

export function updateSPSTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
   const swingInfo = beatmapItem.swingAnalysis;

   htmlSpsAvgTotal.innerText = round(swingInfo.total.perSecond, 2).toString();
   htmlSpsAvgRed.innerText = round(swingInfo.red.perSecond, 2).toString();
   htmlSpsAvgBlue.innerText = round(swingInfo.blue.perSecond, 2).toString();
   htmlSpsMedianTotal.innerText = round(swingInfo.total.median, 2).toString();
   htmlSpsMedianRed.innerText = round(swingInfo.red.median, 2).toString();
   htmlSpsMedianBlue.innerText = round(swingInfo.blue.median, 2).toString();
   htmlSpsPeakTotal.innerText = round(swingInfo.total.peak, 2).toString();
   htmlSpsPeakRed.innerText = round(swingInfo.red.peak, 2).toString();
   htmlSpsPeakBlue.innerText = round(swingInfo.blue.peak, 2).toString();
   htmlSpsTotalTotal.innerText = round(swingInfo.total.total, 2).toString();
   htmlSpsTotalRed.innerText = round(swingInfo.red.total, 2).toString();
   htmlSpsTotalBlue.innerText = round(swingInfo.blue.total, 2).toString();
}
