import { IBeatmapContainer } from '../../types';
import * as types from 'bsmap/types';

export class UIStatsNote {
   static #htmlNcTotal: HTMLTableElement;
   static #htmlNcTotalArc: HTMLTableElement;
   static #htmlNcTotalChain: HTMLTableElement;
   static #htmlNcTotalBomb: HTMLTableElement;

   static #htmlNcRed: HTMLTableElement;
   static #htmlNcRedArc: HTMLTableElement;
   static #htmlNcRedChain: HTMLTableElement;
   static #htmlNcRedBomb: HTMLTableElement;

   static #htmlNcBlue: HTMLTableElement;
   static #htmlNcBlueArc: HTMLTableElement;
   static #htmlNcBlueChain: HTMLTableElement;
   static #htmlNcBlueBomb: HTMLTableElement;

   static #htmlNcChroma: HTMLTableElement;
   static #htmlNcChromaArc: HTMLTableElement;
   static #htmlNcChromaChain: HTMLTableElement;
   static #htmlNcChromaBomb: HTMLTableElement;

   static #htmlNcNoodle: HTMLTableElement;
   static #htmlNcNoodleArc: HTMLTableElement;
   static #htmlNcNoodleChain: HTMLTableElement;
   static #htmlNcNoodleBomb: HTMLTableElement;

   static #htmlNcMe: HTMLTableElement;
   static #htmlNcMeArc: HTMLTableElement;
   static #htmlNcMeChain: HTMLTableElement;
   static #htmlNcMeBomb: HTMLTableElement;

   static init(): void {
      UIStatsNote.#htmlNcTotal = document.querySelector('#stats__table-nc-total')!;
      UIStatsNote.#htmlNcTotalArc = document.querySelector('#stats__table-nc-arc')!;
      UIStatsNote.#htmlNcTotalChain = document.querySelector('#stats__table-nc-chain')!;
      UIStatsNote.#htmlNcTotalBomb = document.querySelector('#stats__table-nc-bomb')!;

      UIStatsNote.#htmlNcRed = document.querySelector('#stats__table-nc-red')!;
      UIStatsNote.#htmlNcRedArc = document.querySelector('#stats__table-nc-arc-red')!;
      UIStatsNote.#htmlNcRedChain = document.querySelector('#stats__table-nc-chain-red')!;
      UIStatsNote.#htmlNcRedBomb = document.querySelector('#stats__table-nc-bomb-red')!;

      UIStatsNote.#htmlNcBlue = document.querySelector('#stats__table-nc-blue')!;
      UIStatsNote.#htmlNcBlueArc = document.querySelector('#stats__table-nc-arc-blue')!;
      UIStatsNote.#htmlNcBlueChain = document.querySelector('#stats__table-nc-chain-blue')!;
      UIStatsNote.#htmlNcBlueBomb = document.querySelector('#stats__table-nc-bomb-blue')!;

      UIStatsNote.#htmlNcChroma = document.querySelector('#stats__table-nc-chroma')!;
      UIStatsNote.#htmlNcChromaArc = document.querySelector('#stats__table-nc-arc-chroma')!;
      UIStatsNote.#htmlNcChromaChain = document.querySelector('#stats__table-nc-chain-chroma')!;
      UIStatsNote.#htmlNcChromaBomb = document.querySelector('#stats__table-nc-bomb-chroma')!;

      UIStatsNote.#htmlNcNoodle = document.querySelector('#stats__table-nc-noodle')!;
      UIStatsNote.#htmlNcNoodleArc = document.querySelector('#stats__table-nc-arc-noodle')!;
      UIStatsNote.#htmlNcNoodleChain = document.querySelector('#stats__table-nc-chain-noodle')!;
      UIStatsNote.#htmlNcNoodleBomb = document.querySelector('#stats__table-nc-bomb-noodle')!;

      UIStatsNote.#htmlNcMe = document.querySelector('#stats__table-nc-me')!;
      UIStatsNote.#htmlNcMeArc = document.querySelector('#stats__table-nc-arc-me')!;
      UIStatsNote.#htmlNcMeChain = document.querySelector('#stats__table-nc-chain-me')!;
      UIStatsNote.#htmlNcMeBomb = document.querySelector('#stats__table-nc-bomb-me')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const noteCount = beatmap.stats.notes;
      const arcCount = beatmap.stats.arcs;
      const chainCount = beatmap.stats.chains;
      const bombCount = beatmap.stats.bombs;

      UIStatsNote.#htmlNcTotal.textContent = (
         noteCount.red.total + noteCount.blue.total
      ).toString();
      UIStatsNote.#htmlNcTotalArc.textContent = (
         arcCount.red.total + arcCount.blue.total
      ).toString();
      UIStatsNote.#htmlNcTotalChain.textContent = (
         chainCount.red.total + chainCount.blue.total
      ).toString();
      UIStatsNote.#htmlNcTotalBomb.textContent = bombCount.total.toString();

      UIStatsNote.#htmlNcRed.textContent = noteCount.red.total.toString();
      UIStatsNote.#htmlNcRedArc.textContent = arcCount.red.total.toString();
      UIStatsNote.#htmlNcRedChain.textContent = chainCount.red.total.toString();

      UIStatsNote.#htmlNcBlue.textContent = noteCount.blue.total.toString();
      UIStatsNote.#htmlNcBlueArc.textContent = arcCount.blue.total.toString();
      UIStatsNote.#htmlNcBlueChain.textContent = chainCount.blue.total.toString();

      if (
         noteCount.red.chroma ||
         noteCount.blue.chroma ||
         arcCount.red.chroma ||
         arcCount.blue.chroma ||
         chainCount.red.chroma ||
         chainCount.blue.chroma ||
         bombCount.chroma
      ) {
         UIStatsNote.#htmlNcChroma.textContent = (
            noteCount.red.chroma + noteCount.blue.chroma
         ).toString();
         UIStatsNote.#htmlNcChromaArc.textContent = (
            arcCount.red.chroma + arcCount.blue.chroma
         ).toString();
         UIStatsNote.#htmlNcChromaChain.textContent = (
            chainCount.red.chroma + chainCount.blue.chroma
         ).toString();
         UIStatsNote.#htmlNcChromaBomb.textContent = bombCount.chroma.toString();
         (UIStatsNote.#htmlNcChroma.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcChromaArc.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcChromaChain.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcChromaBomb.parentNode as HTMLElement).classList.remove('hidden');
      } else {
         (UIStatsNote.#htmlNcChroma.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcChromaArc.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcChromaChain.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcChromaBomb.parentNode as HTMLElement).classList.add('hidden');
      }
      if (
         noteCount.red.noodleExtensions ||
         noteCount.blue.noodleExtensions ||
         arcCount.red.noodleExtensions ||
         arcCount.blue.noodleExtensions ||
         chainCount.red.noodleExtensions ||
         chainCount.blue.noodleExtensions ||
         bombCount.noodleExtensions
      ) {
         UIStatsNote.#htmlNcNoodle.textContent = (
            noteCount.red.noodleExtensions + noteCount.blue.noodleExtensions
         ).toString();
         UIStatsNote.#htmlNcNoodleArc.textContent = (
            arcCount.red.noodleExtensions + arcCount.blue.noodleExtensions
         ).toString();
         UIStatsNote.#htmlNcNoodleChain.textContent = (
            chainCount.red.noodleExtensions + chainCount.blue.noodleExtensions
         ).toString();
         UIStatsNote.#htmlNcNoodleBomb.textContent = bombCount.noodleExtensions.toString();
         (UIStatsNote.#htmlNcNoodle.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcNoodleArc.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcNoodleChain.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcNoodleBomb.parentNode as HTMLElement).classList.remove('hidden');
      } else {
         (UIStatsNote.#htmlNcNoodle.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcNoodleArc.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcNoodleChain.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcNoodleBomb.parentNode as HTMLElement).classList.add('hidden');
      }
      if (
         noteCount.red.mappingExtensions ||
         noteCount.blue.mappingExtensions ||
         arcCount.red.mappingExtensions ||
         arcCount.blue.mappingExtensions ||
         chainCount.red.mappingExtensions ||
         chainCount.blue.mappingExtensions ||
         bombCount.mappingExtensions
      ) {
         UIStatsNote.#htmlNcMe.textContent = (
            noteCount.red.mappingExtensions + noteCount.blue.mappingExtensions
         ).toString();
         UIStatsNote.#htmlNcMeArc.textContent = (
            arcCount.red.mappingExtensions + arcCount.blue.mappingExtensions
         ).toString();
         UIStatsNote.#htmlNcMeChain.textContent = (
            chainCount.red.mappingExtensions + chainCount.blue.mappingExtensions
         ).toString();
         UIStatsNote.#htmlNcMeBomb.textContent = bombCount.mappingExtensions.toString();
         (UIStatsNote.#htmlNcMe.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcMeArc.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcMeChain.parentNode as HTMLElement).classList.remove('hidden');
         (UIStatsNote.#htmlNcMeBomb.parentNode as HTMLElement).classList.remove('hidden');
      } else {
         (UIStatsNote.#htmlNcMe.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcMeArc.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcMeChain.parentNode as HTMLElement).classList.add('hidden');
         (UIStatsNote.#htmlNcMeBomb.parentNode as HTMLElement).classList.add('hidden');
      }
   }
}
