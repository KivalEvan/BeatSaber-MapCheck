import { renamer } from 'bsmap/extensions';
import { IBeatmapContainer } from '../../types';
import { prefix } from './constants';
import * as types from 'bsmap/types';

export class UIStatsEvent {
   static #htmlEventsContent: HTMLTableElement;

   static init(): void {
      UIStatsEvent.#htmlEventsContent = document.querySelector('#stats__table-events-content')!;
   }

   static updateTable(_: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const environment = beatmap.environment;
      const eventCount = beatmap.stats.basicEvents;
      let total = 0;
      let chroma = 0;
      let chromaOld = 0;
      let noodleExtensions = 0;
      let mappingExtensions = 0;

      for (const key in eventCount) {
         total += eventCount[key].total;
      }
      let htmlString = `<tr><th class="${prefix}table-header" colspan="5">Total</th><td class="${prefix}table-element">${total}</td></tr>`;

      for (const key in eventCount) {
         chroma += eventCount[key].chroma;
         chromaOld += eventCount[key].chromaOld;
         htmlString += `<tr><th class="${prefix}table-header">${key}</th><th class="${prefix}table-header" colspan="4">${renamer.eventTypeRename(
            parseInt(key),
            environment,
         )}</th><td class="${prefix}table-element">${eventCount[key].total}</td></tr>`;
      }
      if (chroma) {
         htmlString += `<tr><th class="${prefix}table-header" colspan="5">Chroma</th><td class="${prefix}table-element">${chroma}</td></tr>`;
      }
      if (chromaOld) {
         htmlString += `<tr><th class="${prefix}table-header" colspan="5">OG Chroma</th><td class="${prefix}table-element">${chromaOld}</td></tr>`;
      }
      if (noodleExtensions) {
         htmlString += `<tr><th class="${prefix}table-header" colspan="5">Noodle Extensions</th><td class="${prefix}table-element">${noodleExtensions}</td></tr>`;
      }
      if (mappingExtensions) {
         htmlString += `<tr><th class="${prefix}table-header" colspan="5">Mapping Extensions</th><td class="${prefix}table-element">${mappingExtensions}</td></tr>`;
      }

      UIStatsEvent.#htmlEventsContent.innerHTML = htmlString;
   }
}
