import LoadedData from '../../loadedData';
import { IBeatmapItem } from '../../types';
import { logPrefix, prefix } from './constants';
import { stats } from 'bsmap/extensions';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { getSelectedCharacteristic, getSelectedDifficulty } from '../selection';
import { ObjectContainerType } from '../../types/checks/container';

const htmlCheckNote = document.getElementById('stats__table-angle-note') as HTMLInputElement;
const htmlCheckArc = document.getElementById('stats__table-angle-arc') as HTMLInputElement;
const htmlCheckChain = document.getElementById('stats__table-angle-chain') as HTMLInputElement;
const htmlCheckRed = document.getElementById('stats__table-angle-red') as HTMLInputElement;
const htmlCheckBlue = document.getElementById('stats__table-angle-blue') as HTMLInputElement;
const htmlTableAngle = document.getElementById('stats__table-angle') as HTMLTableElement;

htmlCheckNote.addEventListener('change', noteAngleCheckboxHandler);
htmlCheckArc.addEventListener('change', noteAngleCheckboxHandler);
htmlCheckChain.addEventListener('change', noteAngleCheckboxHandler);
htmlCheckRed.addEventListener('change', noteAngleCheckboxHandler);
htmlCheckBlue.addEventListener('change', noteAngleCheckboxHandler);

const options: { [key: string]: boolean } = {
   note: htmlCheckNote.checked,
   arc: htmlCheckArc.checked,
   chain: htmlCheckChain.checked,
   red: htmlCheckRed.checked,
   blue: htmlCheckBlue.checked,
};

function noteAngleCheckboxHandler(ev: Event): void {
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
   updateNoteAngleTable(beatmapInfo, beatmapItem);
}

// TODO: use angle instead of cut direction
function noteAngleTableString(notes: types.wrapper.IWrapBaseNote[]): string {
   const totalNote = notes.length || 1;
   const cutOrder = [4, 0, 5, 2, 8, 3, 6, 1, 7];
   let htmlString = '';
   for (let y = 0; y < 3; y++) {
      htmlString += '<tr>';
      for (let x = 0; x < 3; x++) {
         let count = stats.countDirection(notes, cutOrder[y * 3 + x]);
         htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
            (count / totalNote) * 100,
            1,
         )}%)</td>`;
      }
      htmlString += `</tr>`;
   }
   return htmlString;
}

export function updateNoteAngleTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
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

   let htmlString = noteAngleTableString(container.map((e) => e.data));
   htmlTableAngle.innerHTML = htmlString;
}
