import { NoteJumpSpeed } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';
import { prefix } from './constants';

export function createSettingsTable(
   info: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): HTMLTableElement {
   const njs = NoteJumpSpeed.create(
      info.audio.bpm,
      beatmapItem.settings.njs || NoteJumpSpeed.FallbackNJS[beatmapItem.settings.difficulty],
      beatmapItem.settings.njsOffset,
   );

   const htmlTable = document.createElement('table');
   htmlTable.className = prefix + 'table';
   htmlTable.innerHTML = `<caption class="${prefix}table-caption">Map Settings:</caption><tr><th class="${prefix}table-header" colspan="2">Note Jump Speed</th><td class="${prefix}table-element">${round(
      njs.value,
      3,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Spawn Distance Modifier</th><td class="${prefix}table-element">${round(
      njs.offset,
      3,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Half Jump Duration</th><td class="${prefix}table-element">${round(
      njs.hjd,
      3,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Jump Distance</th><td class="${prefix}table-element">${round(
      njs.jd,
      3,
   )}</td></tr><tr><th class="${prefix}table-header" colspan="2">Reaction Time</th><td class="${prefix}table-element">${round(
      njs.reactionTime * 1000,
   )}ms</td></tr>`;

   return htmlTable;
}
