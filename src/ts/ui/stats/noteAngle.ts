import { clamp, NoteDirection, NoteDirectionAngle, round, wrapper } from 'bsmap';
import { State } from '../../state';
import { IBeatmapContainer } from '../../types';
import { logPrefix, prefix } from './constants';
import * as stats from 'bsmap/extensions/stats';
import { UISelection } from '../selection';
import { ObjectContainerType } from '../../types/container';
import { PrecalculateKey } from '../../types/precalculate';

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

   static #noteAngleTableString(notes: wrapper.IWrapBaseNote[]): string {
      const totalNote = notes.length || 1;
      const angleBuckets: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (const note of notes) {
         if (note.direction === NoteDirection.ANY) {
            angleBuckets[4]++;
            continue;
         }
         const angle = note.customData[PrecalculateKey.ANGLE] as number;
         let bucket = Math.floor(clamp(Math.round(angle / 45), 0, 7));
         if (bucket >= 4) bucket++;
         angleBuckets[bucket]++;
      }
      let htmlString = '';
      for (let y = 0; y < 3; y++) {
         htmlString += '<tr>';
         for (let x = 0; x < 3; x++) {
            const idx = y * 3 + x;
            const count = angleBuckets[idx];
            htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
               (count / totalNote) * 100,
               1,
            )}%)</td>`;
         }
         htmlString += `</tr>`;
      }
      return htmlString;
   }

   static updateTable(_: wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
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
