import Settings from '../../settings';
import UIPanel from '../helpers/panel';
import { colorToHex, round, toMmss } from '../../bsmap/utils/mod';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { IBookmark as IBookmarkV2 } from '../../bsmap/types/beatmap/v2/custom/bookmark';
import { IBookmark as IBookmarkV3 } from '../../bsmap/types/beatmap/v3/custom/bookmark';
import { htmlTableBookmarks } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBookmarks(
   arr?: Partial<IBookmarkV2 & IBookmarkV3>[],
   bpm?: TimeProcessor | null,
): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableBookmarks);
      return;
   }
   const panel = UIPanel.create('max', 'none', true);
   arr.forEach((elem, i) => {
      let time = elem.b ?? elem._time ?? 0;
      let rt!: number;
      const container = document.createElement('div');
      const colorContainer = document.createElement('div');
      const textContainer = document.createElement('div');
      container.appendChild(colorContainer);
      container.appendChild(textContainer);

      colorContainer.className = 'info__color-dot';
      colorContainer.style.backgroundColor = '#000000';
      textContainer.className = 'info__color-text';

      const text = elem.n ?? elem._name;
      if (typeof text !== 'string') {
         textContainer.textContent = `Error parsing bookmarks[${i}]`;
         panel.appendChild(container);
      }
      if (bpm) {
         time = bpm.adjustTime(time);
         rt = bpm.toRealTime(time);
      }

      const color = elem.c ?? elem._color;
      colorContainer.style.backgroundColor = color
         ? colorToHex({ r: color[0], g: color[1], b: color[2] })
         : '#333333';

      textContainer.textContent = `${round(time, Settings.rounding)}${
         rt ? ' | ' + toMmss(rt) : ''
      } -- ${text != '' ? text : '**EMPTY NAME**'}`;

      panel.appendChild(container);
   });
   displayTableRow(htmlTableBookmarks, [panel]);
}
