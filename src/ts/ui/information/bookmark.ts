import Settings from '../../settings';
import UIPanel from '../helpers/panel';
import { colorToHex, round, toMmss } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { IBookmark } from '../../types/beatmap/v3/custom/bookmark';
import { htmlTableBookmarks } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBookmarks(arr?: IBookmark[], bpm?: BeatPerMinute | null): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableBookmarks);
        return;
    }
    const panel = UIPanel.create('max', 'none', true);
    arr.forEach((elem, i) => {
        let time = elem.b;
        let rt!: number;
        const container = document.createElement('div');
        const colorContainer = document.createElement('div');
        const textContainer = document.createElement('div');
        container.appendChild(colorContainer);
        container.appendChild(textContainer);

        colorContainer.className = 'info__color-dot';
        colorContainer.style.backgroundColor = '#000000';
        textContainer.className = 'info__color-text';

        if (typeof elem.n !== 'string') {
            textContainer.textContent = `Error parsing bookmarks[${i}]`;
            panel.appendChild(container);
        }
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        colorContainer.style.backgroundColor = elem.c
            ? colorToHex({ r: elem.c[0], g: elem.c[1], b: elem.c[2] })
            : '#333333';

        textContainer.textContent = `${round(elem.b, Settings.rounding)}${
            rt ? ' | ' + toMmss(rt) : ''
        } -- ${elem.n != '' ? elem.n : '**EMPTY NAME**'}`;

        panel.appendChild(container);
    });
    displayTableRow(htmlTableBookmarks, [panel]);
}
