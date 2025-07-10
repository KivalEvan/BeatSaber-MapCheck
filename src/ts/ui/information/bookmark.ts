import { Settings } from '../../settings';
import { TimeProcessor } from 'bsmap';
import { colorToHex, round, secToMmss } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';

export function setBookmarks(
   ary?: Partial<types.v2.IBookmark & types.v3.IBookmark>[],
   bpm?: TimeProcessor | null,
): void {
   if (ary == null || !ary.length) {
      hideTableRow(UIInfoHTML.htmlTableBookmarks);
      return;
   }
   const content: HTMLElement[] = [];
   ary.forEach((elem, i) => {
      let time = elem.b ?? elem._time ?? 0;
      let rt!: number;
      const container = document.createElement('div');
      const colorContainer = document.createElement('div');
      const textContainer = document.createElement('div');
      container.appendChild(colorContainer);
      container.appendChild(textContainer);

      container.className = 'info__color';
      colorContainer.className = 'info__color-dot';
      colorContainer.style.backgroundColor = '#000000';
      textContainer.className = 'info__color-text';

      const text = elem.n ?? elem._name;
      if (typeof text !== 'string') {
         textContainer.textContent = `Error parsing bookmarks[${i}]`;
         content.push(container);
      }
      if (bpm) {
         time = bpm.adjustTime(time);
         rt = bpm.toRealTime(time);
      }

      const color = elem.c ?? elem._color;
      colorContainer.style.backgroundColor = color
         ? colorToHex({ r: color[0], g: color[1], b: color[2] })
         : '#333333';

      textContainer.textContent = `${round(time, Settings.props.rounding)}${
         rt ? ' | ' + secToMmss(rt) : ''
      } -- ${text != '' ? text : '**EMPTY NAME**'}`;

      content.push(container);
   });
   displayTableRow(UIInfoHTML.htmlTableBookmarks, content, 'bookmarks');
}
