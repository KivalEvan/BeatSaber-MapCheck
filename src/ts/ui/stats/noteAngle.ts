import UISelect from '../helpers/select';
import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { logPrefix, prefix } from './constants';
import { getFilteredContainer } from './helpers';
import { stats } from 'bsmap/extensions';
import { round, types } from 'bsmap';

function noteAngleSelectHandler(ev: Event) {
   const target = ev.target as HTMLSelectElement;
   const id = target.id.replace(`${prefix}table-select-angle-`, '').split('-');

   const characteristic = id[0];
   const difficulty = id[1];
   const noteContainer = LoadedData.beatmaps.find(
      (set) =>
         set.settings.characteristic === characteristic && set.settings.difficulty === difficulty,
   )?.noteContainer;
   if (!noteContainer) {
      console.error(logPrefix + 'note could not be found');
      return;
   }
   const filteredContainer = getFilteredContainer(noteContainer, target.value).map((e) => e.data);
   const htmlTableBody = document.querySelector(
      `#${prefix}table-angle-${characteristic}-${difficulty}`,
   )!;
   htmlTableBody.innerHTML = noteAngleTableString(filteredContainer);
}

// TODO: use angle instead of cut direction
function noteAngleTableString(notes: types.wrapper.IWrapBaseNote[]): string {
   const totalNote = notes.length || 1;
   const cutOrder = [4, 0, 5, 2, 8, 3, 6, 1, 7];
   let htmlString = '';
   for (let i = 0; i < 3; i++) {
      htmlString += '<tr>';
      for (let j = 0; j < 3; j++) {
         let count = stats.countDirection(notes, cutOrder[i * 3 + j]);
         htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
            (count / totalNote) * 100,
            1,
         )}%)</td>`;
      }
      htmlString += `</tr>`;
   }
   return htmlString;
}

export function createNoteAngleTable(
   beatmapInfo: types.wrapper.IWrapInfo,
   beatmap: IBeatmapItem,
): HTMLTableElement {
   const htmlSelect = UISelect.create(
      `${prefix}table-select-angle-${beatmap.settings.characteristic}-${beatmap.settings.difficulty}`,
      'Note Angle: ',
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
   );
   htmlSelect
      .querySelector<HTMLSelectElement>('select')
      ?.addEventListener('change', noteAngleSelectHandler);

   let htmlString = `<tbody id="${prefix}table-angle-${beatmap.settings.characteristic}-${beatmap.settings.difficulty}">${noteAngleTableString(
      beatmap.noteContainer.map((e) => e.data),
   )}</tbody>`;

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;
   htmlTable.prepend(htmlSelect);

   return htmlTable;
}
