import Settings from '../../settings';
import { round, toMMSS } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared';
import { NEDataAbbr } from '../../types/beatmap/v3';
import { ICustomEvent } from '../../types/beatmap/v3/customEvent';
import { htmlTableCustomEvents } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setCustomEvents(arr?: ICustomEvent[], bpm?: BeatPerMinute | null): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableCustomEvents);
        return;
    }
    const customEv = arr.map((elem, i) => {
        let time = elem.beat;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        const keyArr = [];
        if (!elem.data) {
            return `Error parsing customEvents[${i}]`;
        }
        for (const key in elem.data) {
            if (
                key == '_duration' ||
                key == '_easing' ||
                key == '_track' ||
                key == 'duration' ||
                key == 'easing' ||
                key == 'track'
            ) {
                continue;
            }
            const k = NEDataAbbr[key as keyof typeof NEDataAbbr];
            if (elem.data[key as keyof ICustomEvent['data']] != null) {
                keyArr.push(k);
            }
        }
        return `${round(elem.beat, Settings.rounding)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${elem.type} -> [${keyArr.join(
            '',
        )}]${elem.type !== 'AssignTrackParent' ? `(${elem.data.track})` : ''}`;
    });
    displayTableRow(htmlTableCustomEvents, customEv);
}
