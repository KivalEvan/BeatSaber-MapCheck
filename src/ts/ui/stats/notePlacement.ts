import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { logPrefix, prefix } from './constants';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { stats } from 'bsmap/extensions';
import { ObjectContainerType } from '../../types/checks/container';
import { getSelectedCharacteristic, getSelectedDifficulty } from '../selection';
import flag from '../../flag';

const htmlCheckNote = document.getElementById('stats__table-placement-note') as HTMLInputElement;
const htmlCheckArc = document.getElementById('stats__table-placement-arc') as HTMLInputElement;
const htmlCheckChain = document.getElementById('stats__table-placement-chain') as HTMLInputElement;
const htmlCheckBomb = document.getElementById('stats__table-placement-bomb') as HTMLInputElement;
const htmlCheckRed = document.getElementById('stats__table-placement-red') as HTMLInputElement;
const htmlCheckBlue = document.getElementById('stats__table-placement-blue') as HTMLInputElement;
const htmlTablePlacement = document.getElementById('stats__table-placement') as HTMLTableElement;

htmlCheckNote.addEventListener('change', notePlacementCheckboxHandler);
htmlCheckArc.addEventListener('change', notePlacementCheckboxHandler);
htmlCheckChain.addEventListener('change', notePlacementCheckboxHandler);
htmlCheckBomb.addEventListener('change', notePlacementCheckboxHandler);
htmlCheckRed.addEventListener('change', notePlacementCheckboxHandler);
htmlCheckBlue.addEventListener('change', notePlacementCheckboxHandler);

const options: { [key: string]: boolean } = {
   note: htmlCheckNote.checked,
   arc: htmlCheckArc.checked,
   chain: htmlCheckChain.checked,
   bomb: htmlCheckBomb.checked,
   red: htmlCheckRed.checked,
   blue: htmlCheckBlue.checked,
};

function notePlacementCheckboxHandler(ev: Event): void {
   const t = ev.target as HTMLInputElement;
   const id = t.id.split('-').at(-1)!;
   options[id] = t.checked;

   const beatmapInfo = LoadedData.beatmapInfo!;
   const beatmapItem = LoadedData.beatmaps.find(
      (bm) =>
         bm.settings.characteristic === getSelectedCharacteristic() &&
         bm.settings.difficulty === getSelectedDifficulty(),
   );
   if (!beatmapItem) {
      throw new Error(logPrefix + 'Could not find map data');
   }
   updateNotePlacementTable(beatmapInfo, beatmapItem);
}

function notePlacementTableString(nc: types.wrapper.IWrapGridObject[]): string {
   const totalNote = nc.length || 1;
   let htmlString = '';
   for (let l = 2; l >= 0; l--) {
      htmlString += '<tr>';
      for (let i = 0; i <= 3; i++) {
         htmlString += `<td class="${prefix}table-element">${stats.countXY(nc, i, l)}</td>`;
      }
      htmlString += `<td class="${prefix}table-element ${prefix}table--no-border">${round(
         (stats.countY(nc, l) / totalNote) * 100,
         1,
      )}%</td>
        </tr>`;
   }
   htmlString += `<tr><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (stats.countX(nc, 0) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (stats.countX(nc, 1) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (stats.countX(nc, 2) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (stats.countX(nc, 3) / totalNote) * 100,
      1,
   )}%</td></tr>`;
   return htmlString;
}

export function updateNotePlacementTable(
   _: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): void {
   let container = beatmapItem.noteContainer;

   if (!options.note) {
      container = container.filter((n) => n.type !== ObjectContainerType.COLOR);
   }
   if (!options.arc) {
      container = container.filter((n) => n.type !== ObjectContainerType.ARC);
   }
   if (!options.chain) {
      container = container.filter((n) => n.type !== ObjectContainerType.CHAIN);
   }
   if (!options.bomb) {
      container = container.filter((n) => n.type !== ObjectContainerType.BOMB);
   }
   if (!options.red) {
      container = container.filter((n) => n.data.color !== 0);
   }
   if (!options.blue) {
      container = container.filter((n) => n.data.color !== 1);
   }

   let htmlString = notePlacementTableString(container.map((e) => e.data));
   htmlTablePlacement.innerHTML = htmlString;
}
