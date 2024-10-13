import { round, formatNumber } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';
import { swing } from 'bsmap/extensions';

const htmlNiRatio = document.getElementById('stats__table-ni-ratio') as HTMLTableCellElement;
const htmlNiMaxScore = document.getElementById('stats__table-ni-maxscore') as HTMLTableCellElement;
const htmlNiEffectiveBpm = document.getElementById('stats__table-ni-ebpm') as HTMLTableCellElement;
const htmlNiEffectiveBpmSwing = document.getElementById(
   'stats__table-ni-ebpm-swing',
) as HTMLTableCellElement;
const htmlNiMinSliderSpeed = document.getElementById(
   'stats__table-ni-minspeed',
) as HTMLTableCellElement;
const htmlNiMaxSliderSpeed = document.getElementById(
   'stats__table-ni-maxspeed',
) as HTMLTableCellElement;

export function updateNoteInfoTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
   const noteCount = beatmapItem.stats.notes;

   htmlNiRatio.textContent = round(noteCount.red.total / noteCount.blue.total, 2).toString();
   htmlNiMaxScore.textContent = formatNumber(beatmapItem.score);
   htmlNiEffectiveBpm.textContent = round(
      swing.getMaxEffectiveBpm(beatmapItem.swingAnalysis.container),
      2,
   ).toString();
   htmlNiEffectiveBpmSwing.textContent = round(
      swing.getMaxEffectiveBpmSwing(beatmapItem.swingAnalysis.container),
      2,
   ).toString();

   const minSliderSpeed = round(
      swing.getMinSliderSpeed(beatmapItem.swingAnalysis.container) * 1000,
      1,
   );
   const maxSliderSpeed = round(
      swing.getMaxSliderSpeed(beatmapItem.swingAnalysis.container) * 1000,
      1,
   );
   if (minSliderSpeed || maxSliderSpeed) {
      htmlNiMinSliderSpeed.textContent = minSliderSpeed.toString() + 'ms';
      htmlNiMaxSliderSpeed.textContent = minSliderSpeed.toString() + 'ms';
      (htmlNiMinSliderSpeed.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNiMaxSliderSpeed.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlNiMinSliderSpeed.parentNode as HTMLElement).classList.add('hidden');
      (htmlNiMaxSliderSpeed.parentNode as HTMLElement).classList.add('hidden');
   }
}
