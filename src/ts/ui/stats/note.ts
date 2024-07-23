import { IBeatmapItem } from '../../types';
import { prefix } from './constants';
import { types } from 'bsmap';

export function createNoteCountTable(
   mapInfo: types.wrapper.IWrapInfo,
   mapData: IBeatmapItem,
): HTMLTableElement {
   const noteCount = mapData.stats.notes;
   const arcCount = mapData.stats.arcs;
   const chainCount = mapData.stats.chains;
   const bombCount = mapData.stats.bombs;

   let htmlString = `<caption class="${prefix}table-caption">Note Count:</caption><tr><th class="${prefix}table-header"></th><th class="${prefix}table-header">Note</th><th class="${prefix}table-header">Arc</th><th class="${prefix}table-header">Chain</th><th class="${prefix}table-header">Bomb</th></tr><tr><th class="${prefix}table-header">Total</th><td class="${prefix}table-element">${
      noteCount.red.total + noteCount.blue.total
   }</td><td class="${prefix}table-element">${
      arcCount.red.total + arcCount.blue.total
   }</td><td class="${prefix}table-element">${
      chainCount.red.total + chainCount.blue.total
   }</td><td class="${prefix}table-element">${bombCount.total}</td></tr><tr><th class="${prefix}table-header">Red</th><td class="${prefix}table-element">${noteCount.red.total}</td><td class="${prefix}table-element">${arcCount.red.total}</td><td class="${prefix}table-element">${chainCount.red.total}</td><td class="${prefix}table-element">0</td></tr><tr><th class="${prefix}table-header">Blue</th><td class="${prefix}table-element">${noteCount.blue.total}</td><td class="${prefix}table-element">${arcCount.blue.total}</td><td class="${prefix}table-element">${chainCount.blue.total}</td><td class="${prefix}table-element">0</td></tr>`;
   if (
      noteCount.red.chroma ||
      noteCount.blue.chroma ||
      arcCount.red.chroma ||
      arcCount.blue.chroma ||
      chainCount.red.chroma ||
      chainCount.blue.chroma ||
      bombCount.chroma
   ) {
      htmlString += `<tr><th class="${prefix}table-header">Chroma</th><td class="${prefix}table-element">${
         noteCount.red.chroma + noteCount.blue.chroma
      }</td><td class="${prefix}table-element">${
         arcCount.red.chroma + arcCount.blue.chroma
      }</td><td class="${prefix}table-element">${
         chainCount.red.chroma + chainCount.blue.chroma
      }</td><td class="${prefix}table-element">${bombCount.chroma}</td></tr>`;
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
      htmlString += `<tr><th class="${prefix}table-header">NE</th><td class="${prefix}table-element">${
         noteCount.red.noodleExtensions + noteCount.blue.noodleExtensions
      }</td><td class="${prefix}table-element">${
         arcCount.red.noodleExtensions + arcCount.blue.noodleExtensions
      }</td><td class="${prefix}table-element">${
         chainCount.red.noodleExtensions + chainCount.blue.noodleExtensions
      }</td><td class="${prefix}table-element">${bombCount.noodleExtensions}</td></tr></tr>`;
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
      htmlString += `<tr><th class="${prefix}table-header">ME</th><td class="${prefix}table-element">${
         noteCount.red.mappingExtensions + noteCount.blue.mappingExtensions
      }</td><td class="${prefix}table-element">${
         arcCount.red.mappingExtensions + arcCount.blue.mappingExtensions
      }</td><td class="${prefix}table-element">${
         chainCount.red.mappingExtensions + chainCount.blue.mappingExtensions
      }</td><td class="${prefix}table-element">${bombCount.mappingExtensions}</td></tr></tr>`;
   }

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = htmlString;

   return htmlTable;
}
