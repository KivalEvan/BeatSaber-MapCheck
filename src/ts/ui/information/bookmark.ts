import Settings from '../../settings';
import { round, toMMSS } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared';
import { IBookmark } from '../../types/beatmap/v3';
import { htmlTableBookmarks } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBookmarks(arr?: IBookmark[], bpm?: BeatPerMinute | null): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableBookmarks);
        return;
    }
    const bookmarkText = arr.map((elem, i) => {
        let time = elem._time;
        let rt!: number;
        if (typeof elem._name !== 'string') {
            return `Error parsing bookmarks[${i}]`;
        }
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        return `${round(elem._time, Settings.rounding)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem._name != '' ? elem._name : '**EMPTY NAME**'
        }`;
    });
    displayTableRow(htmlTableBookmarks, bookmarkText);
}
