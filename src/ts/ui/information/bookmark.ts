import Settings from '../../settings';
import UIPanel from '../helpers/panel';
import { RGBAtoHex, round, toMMSS } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { IBookmark } from '../../types/beatmap/v3/bookmark';
import { htmlTableBookmarks } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBookmarks(arr?: IBookmark[], bpm?: BeatPerMinute | null): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableBookmarks);
        return;
    }
    const panel = UIPanel.create('max', 'none', true);
    arr.forEach((elem, i) => {
        let time = elem._time;
        let rt!: number;
        const container = document.createElement('div');
        const colorContainer = document.createElement('div');
        const textContainer = document.createElement('div');
        container.appendChild(colorContainer);
        container.appendChild(textContainer);

        colorContainer.className = 'info__color-dot';
        colorContainer.style.backgroundColor = '#000000';
        textContainer.className = 'info__color-text';

        if (typeof elem._name !== 'string') {
            textContainer.textContent = `Error parsing bookmarks[${i}]`;
            panel.appendChild(container);
        }
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        colorContainer.style.backgroundColor = elem._color
            ? RGBAtoHex({ r: elem._color[0], g: elem._color[1], b: elem._color[2] })
            : '#333333';

        textContainer.textContent = `${round(elem._time, Settings.rounding)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem._name != '' ? elem._name : '**EMPTY NAME**'
        }`;

        panel.appendChild(container);
    });
    displayTableRow(htmlTableBookmarks, [panel]);
}
