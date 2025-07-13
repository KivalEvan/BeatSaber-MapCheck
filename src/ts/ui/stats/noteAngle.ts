import { State } from '../../state';
import { IBeatmapContainer } from '../../types';
import { logPrefix, prefix } from './constants';
import { stats } from 'bsmap/extensions';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { UISelection } from '../selection';
import { ObjectContainerType } from '../../types/container';

export class UIStatsNoteAngle {
   static #htmlCheckNote: HTMLInputElement;
   static #htmlCheckArc: HTMLInputElement;
   static #htmlCheckChain: HTMLInputElement;
   static #htmlCheckRed: HTMLInputElement;
   static #htmlCheckBlue: HTMLInputElement;
   static #htmlTableAngle: HTMLTableElement;

   static #options: { [key: string]: boolean } = {
      note: false,
      arc: false,
      chain: false,
      red: false,
      blue: false,
   };

   static init(): void {
      UIStatsNoteAngle.#htmlCheckNote = document.querySelector('#stats__table-angle-note')!;
      UIStatsNoteAngle.#htmlCheckArc = document.querySelector('#stats__table-angle-arc')!;
      UIStatsNoteAngle.#htmlCheckChain = document.querySelector('#stats__table-angle-chain')!;
      UIStatsNoteAngle.#htmlCheckRed = document.querySelector('#stats__table-angle-red')!;
      UIStatsNoteAngle.#htmlCheckBlue = document.querySelector('#stats__table-angle-blue')!;
      UIStatsNoteAngle.#htmlTableAngle = document.querySelector('#stats__table-angle')!;

      UIStatsNoteAngle.#htmlCheckNote.addEventListener(
         'change',
         UIStatsNoteAngle.#noteAngleCheckboxHandler,
      );
      UIStatsNoteAngle.#htmlCheckArc.addEventListener(
         'change',
         UIStatsNoteAngle.#noteAngleCheckboxHandler,
      );
      UIStatsNoteAngle.#htmlCheckChain.addEventListener(
         'change',
         UIStatsNoteAngle.#noteAngleCheckboxHandler,
      );
      UIStatsNoteAngle.#htmlCheckRed.addEventListener(
         'change',
         UIStatsNoteAngle.#noteAngleCheckboxHandler,
      );
      UIStatsNoteAngle.#htmlCheckBlue.addEventListener(
         'change',
         UIStatsNoteAngle.#noteAngleCheckboxHandler,
      );

      UIStatsNoteAngle.#options.note = UIStatsNoteAngle.#htmlCheckNote.checked;
      UIStatsNoteAngle.#options.arc = UIStatsNoteAngle.#htmlCheckArc.checked;
      UIStatsNoteAngle.#options.chain = UIStatsNoteAngle.#htmlCheckChain.checked;
      UIStatsNoteAngle.#options.red = UIStatsNoteAngle.#htmlCheckRed.checked;
      UIStatsNoteAngle.#options.blue = UIStatsNoteAngle.#htmlCheckBlue.checked;
   }

   static #noteAngleCheckboxHandler(ev: Event): void {
      const t = ev.target as HTMLInputElement;
      const id = t.id.split('-').at(-1)!;
      UIStatsNoteAngle.#options[id] = t.checked;

      const beatmapInfo = State.data.info!;
      const beatmapItem = State.data.beatmaps.find(
         (bm) =>
            bm.info.characteristic === UISelection.getSelectedCharacteristic() &&
            bm.info.difficulty === UISelection.getSelectedDifficulty(),
      );
      if (!beatmapItem) {
         throw new Error(logPrefix + 'Could not find map data');
      }
      UIStatsNoteAngle.updateTable(beatmapInfo, beatmapItem);
   }

   // TODO: use angle instead of cut direction
   static #noteAngleTableString(notes: types.wrapper.IWrapBaseNote[]): string {
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

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      let nc = beatmap.noteContainer;

      if (!UIStatsNoteAngle.#options.note) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.COLOR);
      }
      if (!UIStatsNoteAngle.#options.arc) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.ARC);
      }
      if (!UIStatsNoteAngle.#options.chain) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.CHAIN);
      }
      if (!UIStatsNoteAngle.#options.bomb) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.BOMB);
      }
      if (!UIStatsNoteAngle.#options.red) {
         nc = nc.filter((n) => n.data.color !== 0);
      }
      if (!UIStatsNoteAngle.#options.blue) {
         nc = nc.filter((n) => n.data.color !== 1);
      }

      let htmlString = UIStatsNoteAngle.#noteAngleTableString(nc.map((e) => e.data));
      UIStatsNoteAngle.#htmlTableAngle.innerHTML = htmlString;
   }
}
