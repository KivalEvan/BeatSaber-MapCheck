import Settings from '../../settings';
import { round, toMmss } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { ICustomEvent } from '../../types/beatmap/v3/custom/customEvent';
import { htmlTableCustomEvents } from './constants';
import { displayTableRow, hideTableRow } from './helpers';
import { NEDataAbbreviation } from '../../analyzers/renamer/customData';

export function setCustomEvents(arr?: ICustomEvent[], bpm?: BeatPerMinute | null): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableCustomEvents);
        return;
    }
    const customEv = arr.map((elem, i) => {
        let time = elem.b;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        const keyArr = [];
        if (!elem.d) {
            return `Error parsing customEvents[${i}]`;
        }
        for (const key in elem.d) {
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
            const k = NEDataAbbreviation[key as keyof typeof NEDataAbbreviation];
            if (elem.d[key as keyof ICustomEvent['d']] != null) {
                keyArr.push(k);
            }
        }
        return `${round(elem.b, Settings.rounding)}${rt ? ' | ' + toMmss(rt) : ''} -- ${
            elem.t
        } -> [${keyArr.join('')}]${elem.t !== 'AssignTrackParent' ? `(${elem.d.track})` : ''}`;
    });
    displayTableRow(htmlTableCustomEvents, customEv);
}
