import { BeatPerMinute } from '../beatmap/shared/bpm';
import settings from '../settings';
import { round } from '../utils/math';
import { toMMSS, toMMSSMS } from '../utils/time';

export const printResult = (label: string, text?: string) => {
    const htmlContainer = document.createElement('div');

    if (text) {
        htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
    } else {
        htmlContainer.innerHTML = `<b>${label}</b>`;
    }

    return htmlContainer;
};

export const printResultTime = (label: string, timeAry: number[], bpm: BeatPerMinute) => {
    const htmlContainer = document.createElement('div');
    htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
        .map((n) => {
            switch (settings.beatNumbering) {
                case 'realtime':
                    return toMMSS(bpm.toRealTime(n));
                case 'realtimems':
                    return toMMSSMS(bpm.toRealTime(n));
                case 'jsontime':
                    return round(n, settings.rounding);
                case 'beattime':
                default:
                    return round(bpm.adjustTime(n), settings.rounding);
            }
        })
        .join(', ')}`;

    return htmlContainer;
};
