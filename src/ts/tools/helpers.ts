import { BeatPerMinute } from '../beatmap/shared/bpm';
import settings from '../settings';
import { round } from '../utils/math';
import { toMMSS, toMMSSMS } from '../utils/time';

export function printResult(label: string, text?: string) {
    const htmlContainer = document.createElement('div');

    if (text) {
        htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
    } else {
        htmlContainer.innerHTML = `<b>${label}</b>`;
    }

    return htmlContainer;
}

export function printResultTime(label: string, timeAry: number[], bpm: BeatPerMinute) {
    const htmlContainer = document.createElement('div');
    htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
        .map((n) => {
            switch (settings.beatNumbering) {
                case 'realtime':
                    return `<span title="Beat ${round(bpm.adjustTime(n), settings.rounding)}">${toMMSS(
                        bpm.toRealTime(n),
                    )}</span>`;
                case 'realtimems':
                    return `<span title="Beat ${round(bpm.adjustTime(n), settings.rounding)}">${toMMSSMS(
                        bpm.toRealTime(n),
                    )}</span>`;
                case 'jsontime':
                    return `<span title="Time ${toMMSSMS(bpm.toRealTime(n))}">${round(n, settings.rounding)}</span>`;
                case 'beattime':
                default:
                    return `<span title="Time ${toMMSSMS(bpm.toRealTime(n))}">${round(
                        bpm.adjustTime(n),
                        settings.rounding,
                    )}</span>`;
            }
        })
        .join(', ')}`;

    return htmlContainer;
}
