import UISelect from '../helpers/select';
import LoadedData from '../../loadedData';
import { round } from '../../bsmap/utils/mod';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from '../../types';
import { INoteContainer } from '../../types/tools/container';
import { countX, countXY, countY } from '../../bsmap/extensions/stats/note';
import { logPrefix, prefix } from './constants';
import { getFilteredContainer } from './helpers';
import { IWrapGridObjectAttribute } from '../../bsmap/types/beatmap/wrapper/gridObject';

function notePlacementSelectHandler(ev: Event) {
   const target = ev.target as HTMLSelectElement;
   const id = target.id.replace(`${prefix}table-select-placement-`, '').split('-');

   const characteristic = id[0];
   const difficulty = id[1];
   const noteContainer = LoadedData.beatmaps.find(
      (bm) =>
         bm.settings.characteristic === characteristic && bm.settings.difficulty === difficulty,
   )?.noteContainer;
   if (!noteContainer) {
      console.error(logPrefix + 'note could not be found');
      return;
   }
   const filteredContainer = getFilteredContainer(noteContainer, target.value).map((e) => e.data);
   const htmlTableBody = document.querySelector(
      `#${prefix}table-placement-${characteristic}-${difficulty}`,
   )!;
   htmlTableBody.innerHTML = notePlacementTableString(filteredContainer);
}

function notePlacementTableString(nc: IWrapGridObjectAttribute[]): string {
   const totalNote = nc.length || 1;
   let htmlString = '';
   for (let l = 2; l >= 0; l--) {
      htmlString += '<tr>';
      for (let i = 0; i <= 3; i++) {
         htmlString += `<td class="${prefix}table-element">${countXY(nc, i, l)}</td>`;
      }
      htmlString += `<td class="${prefix}table-element ${prefix}table--no-border">${round(
         (countY(nc, l) / totalNote) * 100,
         1,
      )}%</td>
        </tr>`;
   }
   htmlString += `<tr><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (countX(nc, 0) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (countX(nc, 1) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (countX(nc, 2) / totalNote) * 100,
      1,
   )}%</td><td class="${prefix}table-element ${prefix}table--no-border">${round(
      (countX(nc, 3) / totalNote) * 100,
      1,
   )}%</td></tr>`;
   return htmlString;
}

export function createNotePlacementTable(
   beatmapInfo: IWrapInfo,
   beatmap: IBeatmapItem,
): HTMLTableElement {
   const htmlSelect = UISelect.create(
      `${prefix}table-select-placement-${beatmap.settings.characteristic}-${beatmap.settings.difficulty}`,
      'Note Placement: ',
      'caption',
      `${prefix}table-caption`,
      { text: 'All', value: 'all' },
      { text: 'Note Only', value: 'note' },
      { text: 'Red Note', value: 'red' },
      { text: 'Blue Note', value: 'blue' },
      { text: 'Arc Only', value: 'arc' },
      { text: 'Red Arc', value: 'redArc' },
      { text: 'Blue Arc', value: 'blueArc' },
      { text: 'Chain Only', value: 'chain' },
      { text: 'Red Chain', value: 'redChain' },
      { text: 'Blue Chain', value: 'blueChain' },
      { text: 'Bomb', value: 'bomb' },
   );
   htmlSelect
      .querySelector<HTMLSelectElement>('select')
      ?.addEventListener('change', notePlacementSelectHandler);

   let htmlString = `<tbody id="${prefix}table-placement-${beatmap.settings.characteristic}-${beatmap.settings.difficulty}">${notePlacementTableString(
      beatmap.noteContainer.map((e) => e.data),
   )}</tbody>`;

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;
   htmlTable.prepend(htmlSelect);

   return htmlTable;
}
