import { State } from '../../state';
import { IBeatmapContainer } from '../../types';
import { logPrefix, prefix } from './constants';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { stats } from 'bsmap/extensions';
import { ObjectContainerType } from '../../types/container';
import { UISelection } from '../selection';

export class UIStatsNotePlacement {
   static #htmlCheckNote: HTMLInputElement;
   static #htmlCheckArc: HTMLInputElement;
   static #htmlCheckChain: HTMLInputElement;
   static #htmlCheckBomb: HTMLInputElement;
   static #htmlCheckRed: HTMLInputElement;
   static #htmlCheckBlue: HTMLInputElement;
   static #htmlTablePlacement: HTMLTableElement;

   static #options: { [key: string]: boolean } = {
      note: false,
      arc: false,
      chain: false,
      bomb: false,
      red: false,
      blue: false,
   };

   static init(): void {
      UIStatsNotePlacement.#htmlCheckNote = document.querySelector('#stats__table-placement-note')!;
      UIStatsNotePlacement.#htmlCheckArc = document.querySelector('#stats__table-placement-arc')!;
      UIStatsNotePlacement.#htmlCheckChain = document.querySelector(
         '#stats__table-placement-chain',
      )!;
      UIStatsNotePlacement.#htmlCheckBomb = document.querySelector('#stats__table-placement-bomb')!;
      UIStatsNotePlacement.#htmlCheckRed = document.querySelector('#stats__table-placement-red')!;
      UIStatsNotePlacement.#htmlCheckBlue = document.querySelector('#stats__table-placement-blue')!;
      UIStatsNotePlacement.#htmlTablePlacement = document.querySelector('#stats__table-placement')!;

      UIStatsNotePlacement.#htmlCheckNote.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );
      UIStatsNotePlacement.#htmlCheckArc.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );
      UIStatsNotePlacement.#htmlCheckChain.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );
      UIStatsNotePlacement.#htmlCheckBomb.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );
      UIStatsNotePlacement.#htmlCheckRed.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );
      UIStatsNotePlacement.#htmlCheckBlue.addEventListener(
         'change',
         UIStatsNotePlacement.#notePlacementCheckboxHandler,
      );

      UIStatsNotePlacement.#options.note = UIStatsNotePlacement.#htmlCheckNote.checked;
      UIStatsNotePlacement.#options.arc = UIStatsNotePlacement.#htmlCheckArc.checked;
      UIStatsNotePlacement.#options.chain = UIStatsNotePlacement.#htmlCheckChain.checked;
      UIStatsNotePlacement.#options.bomb = UIStatsNotePlacement.#htmlCheckBomb.checked;
      UIStatsNotePlacement.#options.red = UIStatsNotePlacement.#htmlCheckRed.checked;
      UIStatsNotePlacement.#options.blue = UIStatsNotePlacement.#htmlCheckBlue.checked;
   }

   static #notePlacementCheckboxHandler(ev: Event): void {
      const t = ev.target as HTMLInputElement;
      const id = t.id.split('-').at(-1)!;
      UIStatsNotePlacement.#options[id] = t.checked;

      const beatmapInfo = State.data.info!;
      const beatmapItem = State.data.beatmaps.find(
         (bm) =>
            bm.info.characteristic === UISelection.getSelectedCharacteristic() &&
            bm.info.difficulty === UISelection.getSelectedDifficulty(),
      );
      if (!beatmapItem) {
         throw new Error(logPrefix + 'Could not find map data');
      }
      UIStatsNotePlacement.updateTable(beatmapInfo, beatmapItem);
   }

   static #notePlacementTableString(nc: types.wrapper.IWrapGridObject[]): string {
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

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      let nc = beatmap.noteContainer;

      if (!UIStatsNotePlacement.#options.note) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.COLOR);
      }
      if (!UIStatsNotePlacement.#options.arc) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.ARC);
      }
      if (!UIStatsNotePlacement.#options.chain) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.CHAIN);
      }
      if (!UIStatsNotePlacement.#options.bomb) {
         nc = nc.filter((n) => n.type !== ObjectContainerType.BOMB);
      }
      if (!UIStatsNotePlacement.#options.red) {
         nc = nc.filter((n) => n.data.color !== 0);
      }
      if (!UIStatsNotePlacement.#options.blue) {
         nc = nc.filter((n) => n.data.color !== 1);
      }

      let htmlString = UIStatsNotePlacement.#notePlacementTableString(nc.map((e) => e.data));
      UIStatsNotePlacement.#htmlTablePlacement.innerHTML = htmlString;
   }
}
