import { IBeatmapItem } from '../../types';
import * as types from 'bsmap/types';

const htmlNcTotal = document.getElementById('stats__table-nc-total') as HTMLTableElement;
const htmlNcTotalArc = document.getElementById('stats__table-nc-arc') as HTMLTableElement;
const htmlNcTotalChain = document.getElementById('stats__table-nc-chain') as HTMLTableElement;
const htmlNcTotalBomb = document.getElementById('stats__table-nc-bomb') as HTMLTableElement;

const htmlNcRed = document.getElementById('stats__table-nc-red') as HTMLTableElement;
const htmlNcRedArc = document.getElementById('stats__table-nc-arc-red') as HTMLTableElement;
const htmlNcRedChain = document.getElementById('stats__table-nc-chain-red') as HTMLTableElement;
const htmlNcRedBomb = document.getElementById('stats__table-nc-bomb-red') as HTMLTableElement;

const htmlNcBlue = document.getElementById('stats__table-nc-blue') as HTMLTableElement;
const htmlNcBlueArc = document.getElementById('stats__table-nc-arc-blue') as HTMLTableElement;
const htmlNcBlueChain = document.getElementById('stats__table-nc-chain-blue') as HTMLTableElement;
const htmlNcBlueBomb = document.getElementById('stats__table-nc-bomb-blue') as HTMLTableElement;

const htmlNcChroma = document.getElementById('stats__table-nc-chroma') as HTMLTableElement;
const htmlNcChromaArc = document.getElementById('stats__table-nc-arc-chroma') as HTMLTableElement;
const htmlNcChromaChain = document.getElementById(
   'stats__table-nc-chain-chroma',
) as HTMLTableElement;
const htmlNcChromaBomb = document.getElementById('stats__table-nc-bomb-chroma') as HTMLTableElement;

const htmlNcNoodle = document.getElementById('stats__table-nc-noodle') as HTMLTableElement;
const htmlNcNoodleArc = document.getElementById('stats__table-nc-arc-noodle') as HTMLTableElement;
const htmlNcNoodleChain = document.getElementById(
   'stats__table-nc-chain-noodle',
) as HTMLTableElement;
const htmlNcNoodleBomb = document.getElementById('stats__table-nc-bomb-noodle') as HTMLTableElement;

const htmlNcMe = document.getElementById('stats__table-nc-me') as HTMLTableElement;
const htmlNcMeArc = document.getElementById('stats__table-nc-arc-me') as HTMLTableElement;
const htmlNcMeChain = document.getElementById('stats__table-nc-chain-me') as HTMLTableElement;
const htmlNcMeBomb = document.getElementById('stats__table-nc-bomb-me') as HTMLTableElement;

export function updateNoteCountTable(_: types.wrapper.IWrapInfo, beatmapItem: IBeatmapItem): void {
   const noteCount = beatmapItem.stats.notes;
   const arcCount = beatmapItem.stats.arcs;
   const chainCount = beatmapItem.stats.chains;
   const bombCount = beatmapItem.stats.bombs;

   htmlNcTotal.textContent = (noteCount.red.total + noteCount.blue.total).toString();
   htmlNcTotalArc.textContent = (arcCount.red.total + arcCount.blue.total).toString();
   htmlNcTotalChain.textContent = (chainCount.red.total + chainCount.blue.total).toString();
   htmlNcTotalBomb.textContent = bombCount.total.toString();

   htmlNcRed.textContent = noteCount.red.total.toString();
   htmlNcRedArc.textContent = arcCount.red.total.toString();
   htmlNcRedChain.textContent = chainCount.red.total.toString();

   htmlNcBlue.textContent = noteCount.blue.total.toString();
   htmlNcBlueArc.textContent = arcCount.blue.total.toString();
   htmlNcBlueChain.textContent = chainCount.blue.total.toString();

   if (
      noteCount.red.chroma ||
      noteCount.blue.chroma ||
      arcCount.red.chroma ||
      arcCount.blue.chroma ||
      chainCount.red.chroma ||
      chainCount.blue.chroma ||
      bombCount.chroma
   ) {
      htmlNcChroma.textContent = (noteCount.red.chroma + noteCount.blue.chroma).toString();
      htmlNcChromaArc.textContent = (arcCount.red.chroma + arcCount.blue.chroma).toString();
      htmlNcChromaChain.textContent = (chainCount.red.chroma + chainCount.blue.chroma).toString();
      htmlNcChromaBomb.textContent = bombCount.chroma.toString();
      (htmlNcChroma.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcChromaArc.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcChromaChain.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcChromaBomb.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlNcChroma.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcChromaArc.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcChromaChain.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcChromaBomb.parentNode as HTMLElement).classList.add('hidden');
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
      htmlNcNoodle.textContent = (
         noteCount.red.noodleExtensions + noteCount.blue.noodleExtensions
      ).toString();
      htmlNcNoodleArc.textContent = (
         arcCount.red.noodleExtensions + arcCount.blue.noodleExtensions
      ).toString();
      htmlNcNoodleChain.textContent = (
         chainCount.red.noodleExtensions + chainCount.blue.noodleExtensions
      ).toString();
      htmlNcNoodleBomb.textContent = bombCount.noodleExtensions.toString();
      (htmlNcNoodle.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcNoodleArc.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcNoodleChain.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcNoodleBomb.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlNcNoodle.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcNoodleArc.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcNoodleChain.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcNoodleBomb.parentNode as HTMLElement).classList.add('hidden');
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
      htmlNcMe.textContent = (
         noteCount.red.mappingExtensions + noteCount.blue.mappingExtensions
      ).toString();
      htmlNcMeArc.textContent = (
         arcCount.red.mappingExtensions + arcCount.blue.mappingExtensions
      ).toString();
      htmlNcMeChain.textContent = (
         chainCount.red.mappingExtensions + chainCount.blue.mappingExtensions
      ).toString();
      htmlNcMeBomb.textContent = bombCount.mappingExtensions.toString();
      (htmlNcMe.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcMeArc.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcMeChain.parentNode as HTMLElement).classList.remove('hidden');
      (htmlNcMeBomb.parentNode as HTMLElement).classList.remove('hidden');
   } else {
      (htmlNcMe.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcMeArc.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcMeChain.parentNode as HTMLElement).classList.add('hidden');
      (htmlNcMeBomb.parentNode as HTMLElement).classList.add('hidden');
   }
}
